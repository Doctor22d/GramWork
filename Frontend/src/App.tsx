import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppRoutes from './routes';
import { useWebSocket } from './hooks/useWebSocket';
import { useAuthStore } from './stores/authStore';

function App() {
  const { user, isAuthenticated } = useAuthStore();
  
  // Initialize WebSocket connection for authenticated users
  useWebSocket(isAuthenticated ? user?.id : null);

  return (
    <Router>
      <AppRoutes />
      <Toaster position="top-right" richColors closeButton />
    </Router>
  );
}

export default App;
