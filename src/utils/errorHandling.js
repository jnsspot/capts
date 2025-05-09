import store from '../store';

export const setupErrorHandling = () => {
  // Global error handler
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global error:', { message, source, lineno, colno, error });
    store.commit('SET_ERROR', {
      message: 'An unexpected error occurred',
      code: 'UNEXPECTED_ERROR'
    });
    return false;
  };

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    store.commit('SET_ERROR', {
      message: 'Operation failed. Please try again.',
      code: 'PROMISE_REJECTION'
    });
  });
};

// Custom error handler for API calls
export const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  const errorCode = error.response?.status || 'UNKNOWN_ERROR';
  
  store.commit('SET_ERROR', {
    message: errorMessage,
    code: errorCode
  });

  // Log error for monitoring
  console.error('API Error:', {
    message: errorMessage,
    code: errorCode,
    timestamp: new Date().toISOString()
  });

  return Promise.reject(error);
}; 