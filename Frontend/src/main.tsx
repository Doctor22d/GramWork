import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

// Simple test to see if React loads
console.log('🚀 React is loading...');
console.log('🚀 Environment:', import.meta.env.MODE);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Lazy load App to catch errors
const App = React.lazy(() => import('./App.tsx').catch(err => {
  console.error('❌ Failed to load App:', err);
  return {
    default: () => (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: 'red' }}>Error Loading App</h1>
        <p>Check console for details (F12)</p>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {err.toString()}
        </pre>
      </div>
    )
  };
}));

try {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  console.log('🚀 Root created, rendering App...');
  
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <React.Suspense fallback={
          <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Loading GramWork...</h2>
            <p>If this stays forever, check console (F12)</p>
          </div>
        }>
          <App />
        </React.Suspense>
      </QueryClientProvider>
    </React.StrictMode>
  );
  
  console.log('✅ App rendered successfully!');
} catch (error) {
  console.error('❌ Fatal error:', error);
  document.getElementById('root')!.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1 style="color: red;">Fatal Error</h1>
      <p>Application failed to start. Check console (F12)</p>
      <pre style="background: #f5f5f5; padding: 10px;">${error}</pre>
    </div>
  `;
}
