/**
 * Secure logging utility that respects environment settings
 * Only logs in development mode to prevent information leakage in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  static info(message, ...args) {
    if (isDevelopment) {
      console.log(message, ...args);
    }
  }

  static warn(message, ...args) {
    if (isDevelopment) {
      console.warn(message, ...args);
    }
  }

  static error(message, ...args) {
    // Always log errors, but sanitize sensitive data in production
    if (isDevelopment) {
      console.error(message, ...args);
    } else {
      // In production, log only essential error info without sensitive data
      const sanitizedArgs = args.map(arg => 
        typeof arg === 'object' && arg !== null 
          ? '[Object data hidden in production]' 
          : String(arg).replace(/password|token|key|secret/gi, '[REDACTED]')
      );
      console.error(message, ...sanitizedArgs);
    }
  }

  static debug(message, ...args) {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
}

export default Logger;