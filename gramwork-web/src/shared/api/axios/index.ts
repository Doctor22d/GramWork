import axios from 'axios';

// Use a relative base URL so requests go through Next.js rewrites proxy.
// The proxy handles routing to the correct microservice port, which also
// avoids CORS issues since the browser only talks to localhost:3000.
const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Implement global error interceptor
    const status = error.response?.status;
    const message = error.response?.data?.message || 'An unexpected error occurred';

    if (typeof window !== 'undefined') {
      const { toast } = await import('sonner');
      switch (status) {
        case 400:
          toast.error(`Bad Request: ${message}`);
          break;
        case 401:
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            if (isRefreshing) {
              return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
              }).then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return api(originalRequest);
              }).catch(err => {
                return Promise.reject(err);
              });
            }

            isRefreshing = true;
            
            try {
              // Attempt to refresh the token. 
              // Assumes backend supports a persistent cookie or refresh token
              const rs = await axios.post('/api/auth/refresh');
              const { token } = rs.data;
              
              localStorage.setItem('token', token);
              api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              
              processQueue(null, token);
              
              return api(originalRequest);
            } catch (_error) {
              processQueue(_error, null);
              toast.error('Session expired. Please log in again.');
              localStorage.removeItem('token');
              document.cookie = 'token=; path=/; max-age=0';
              window.location.href = '/login';
              return Promise.reject(_error);
            } finally {
              isRefreshing = false;
            }
          }
          break;
        case 403:
          toast.error('Forbidden: You do not have permission.');
          break;
        case 404:
          toast.error(`Not Found: ${message}`);
          break;
        case 409:
          toast.error(`Conflict: ${message}`);
          break;
        case 422:
          toast.error(`Validation Error: ${message}`);
          break;
        case 500:
        case 502:
        case 503:
          toast.error('Server Error. Please try again later.');
          break;
        default:
          toast.error(message);
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
