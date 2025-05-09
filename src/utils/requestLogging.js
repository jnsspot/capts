import { auth } from '../firebase/firebaseConfig';

// Request logging configuration
const LOG_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
};

// Log storage in memory (in production, this should be sent to a logging service)
const requestLogs = [];

export const setupRequestLogging = () => {
  // Intercept fetch requests
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const startTime = Date.now();
    const [resource, config] = args;
    
    try {
      const response = await originalFetch(...args);
      const endTime = Date.now();
      
      logRequest({
        resource,
        method: config?.method || 'GET',
        status: response.status,
        duration: endTime - startTime,
        timestamp: new Date().toISOString(),
        userId: auth.currentUser?.uid || 'anonymous'
      });
      
      return response;
    } catch (error) {
      logRequest({
        resource,
        method: config?.method || 'GET',
        status: 'ERROR',
        error: error.message,
        timestamp: new Date().toISOString(),
        userId: auth.currentUser?.uid || 'anonymous',
        level: LOG_LEVELS.ERROR
      });
      throw error;
    }
  };
};

const logRequest = (logData) => {
  const log = {
    ...logData,
    level: logData.level || LOG_LEVELS.INFO
  };
  
  requestLogs.push(log);
  
  // In production, send logs to a logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement logging service integration
    console.log('Request Log:', log);
  }
};

// Export logs for debugging
export const getRequestLogs = () => [...requestLogs]; 