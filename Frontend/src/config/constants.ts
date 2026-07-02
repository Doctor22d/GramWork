// API Base URLs
// All services are accessed through the API Gateway on port 8080
const API_GATEWAY = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';

export const API_URLS = {
  AUTH: import.meta.env.VITE_AUTH_SERVICE_URL || API_GATEWAY,
  PROFILE: import.meta.env.VITE_PROFILE_SERVICE_URL || API_GATEWAY,
  JOB: import.meta.env.VITE_JOB_SERVICE_URL || API_GATEWAY,
  ASSIGNMENT: import.meta.env.VITE_ASSIGNMENT_SERVICE_URL || API_GATEWAY,
  AI_MATCHING: import.meta.env.VITE_AI_MATCHING_SERVICE_URL || API_GATEWAY,
  ATTENDANCE: import.meta.env.VITE_ATTENDANCE_SERVICE_URL || API_GATEWAY,
  PAYMENT: import.meta.env.VITE_PAYMENT_SERVICE_URL || API_GATEWAY,
  NOTIFICATION: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || API_GATEWAY,
} as const;

// WebSocket URL
export const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8088/ws-notifications';

// Map Configuration
export const MAP_CONFIG = {
  TILE_URL: import.meta.env.VITE_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: import.meta.env.VITE_MAP_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  DEFAULT_LAT: parseFloat(import.meta.env.VITE_DEFAULT_LAT || '20.5937'),
  DEFAULT_LNG: parseFloat(import.meta.env.VITE_DEFAULT_LNG || '78.9629'),
  DEFAULT_ZOOM: parseInt(import.meta.env.VITE_DEFAULT_ZOOM || '5'),
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'gramwork_auth_token',
  USER_DATA: 'gramwork_user_data',
  THEME: 'gramwork_theme',
} as const;

// Default Search Radius (in km)
export const DEFAULT_SEARCH_RADIUS = 50;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  INITIAL_PAGE: 1,
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  AUTH: {
    USER: 'user',
  },
  WORKER: {
    PROFILE: 'worker-profile',
    NEARBY_JOBS: 'nearby-jobs',
    ASSIGNMENTS: 'worker-assignments',
    ATTENDANCE: 'worker-attendance',
    PAYMENTS: 'worker-payments',
  },
  EMPLOYER: {
    PROFILE: 'employer-profile',
    JOBS: 'employer-jobs',
    JOB_DETAIL: 'job-detail',
    NEARBY_WORKERS: 'nearby-workers',
    ASSIGNMENTS: 'employer-assignments',
    PAYMENTS: 'employer-payments',
    MATCHING: 'job-matching',
  },
  ADMIN: {
    USERS: 'admin-users',
    JOBS: 'admin-jobs',
    PAYMENTS: 'admin-payments',
    STATS: 'admin-stats',
  },
  NOTIFICATIONS: 'notifications',
  ATTENDANCE: 'attendance',
} as const;

// Role-based routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Worker routes
  WORKER: {
    DASHBOARD: '/worker/dashboard',
    PROFILE: '/worker/profile',
    JOBS: '/worker/jobs',
    ASSIGNMENTS: '/worker/assignments',
    ATTENDANCE: '/worker/attendance',
    PAYMENTS: '/worker/payments',
  },
  
  // Employer routes
  EMPLOYER: {
    DASHBOARD: '/employer/dashboard',
    PROFILE: '/employer/profile',
    JOBS: '/employer/jobs',
    CREATE_JOB: '/employer/jobs/create',
    JOB_DETAIL: '/employer/jobs/:id',
    WORKERS: '/employer/workers',
    ASSIGNMENTS: '/employer/assignments',
    ATTENDANCE: '/employer/attendance',
    PAYMENTS: '/employer/payments',
  },
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    JOBS: '/admin/jobs',
    PAYMENTS: '/admin/payments',
    ANALYTICS: '/admin/analytics',
  },
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
  TIME: 'HH:mm',
} as const;

// Validation constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,
  MIN_OTP_LENGTH: 6,
  MAX_OTP_LENGTH: 6,
  MIN_WAGE: 0,
  MAX_WAGE: 100000,
  MIN_EXPERIENCE: 0,
  MAX_EXPERIENCE: 50,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  AADHAAR_REGEX: /^\d{12}$/,
  PINCODE_REGEX: /^\d{6}$/,
} as const;
