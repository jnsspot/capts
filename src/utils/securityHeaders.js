export const setupSecurityHeaders = () => {
  // Add security headers to all responses
  const securityHeaders = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  };

  // Apply headers to all responses
  if (typeof window !== 'undefined') {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      document.head.appendChild(
        Object.assign(document.createElement('meta'), {
          httpEquiv: key,
          content: value
        })
      );
    });
  }
}; 