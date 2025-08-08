/**
 * Input validation and sanitization utilities
 * Helps prevent XSS, injection attacks, and ensures data integrity
 */

// Email validation using a secure regex pattern
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // RFC 5322 compliant email regex (simplified but secure)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email) && email.length <= 254; // RFC limit
};

// Password strength validation
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' };
  }
  
  // Check for at least one uppercase, lowercase, number, and special character
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecial) {
    return {
      isValid: false,
      message: 'Password must contain uppercase, lowercase, number, and special character'
    };
  }
  
  return { isValid: true, message: 'Password is strong' };
};

// Sanitize text input to prevent XSS
export const sanitizeText = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length to prevent DoS
};

// Validate and sanitize assessment data
export const validateAssessmentData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid assessment data format');
  }
  
  const sanitized = {};
  
  // Validate arrays
  ['fiveWhyProblems', 'workTasks', 'workRequirements'].forEach(field => {
    if (data[field] && Array.isArray(data[field])) {
      sanitized[field] = data[field]
        .slice(0, 50) // Limit array size
        .map(item => {
          if (typeof item === 'object') {
            const sanitizedItem = {};
            Object.keys(item).forEach(key => {
              if (typeof item[key] === 'string') {
                sanitizedItem[key] = sanitizeText(item[key]);
              } else if (typeof item[key] === 'number' && !isNaN(item[key])) {
                sanitizedItem[key] = Math.max(-10, Math.min(10, item[key])); // Clamp numbers
              }
            });
            return sanitizedItem;
          }
          return typeof item === 'string' ? sanitizeText(item) : item;
        });
    }
  });
  
  // Validate values object
  if (data.values && typeof data.values === 'object') {
    sanitized.values = {};
    ['all', 'top10', 'top5'].forEach(field => {
      if (Array.isArray(data.values[field])) {
        sanitized.values[field] = data.values[field]
          .slice(0, field === 'all' ? 100 : field === 'top10' ? 10 : 5)
          .map(value => typeof value === 'string' ? sanitizeText(value) : value)
          .filter(value => value && value.length > 0);
      }
    });
  }
  
  // Validate wheelOfLife object
  if (data.wheelOfLife && typeof data.wheelOfLife === 'object') {
    sanitized.wheelOfLife = {};
    Object.keys(data.wheelOfLife).forEach(key => {
      if (typeof data.wheelOfLife[key] === 'number') {
        sanitized.wheelOfLife[key] = Math.max(-3, Math.min(3, data.wheelOfLife[key]));
      } else if (typeof data.wheelOfLife[key] === 'object') {
        sanitized.wheelOfLife[key] = data.wheelOfLife[key]; // Keep justifications as-is for now
      }
    });
  }
  
  return sanitized;
};

// Rate limiting helper
export const createRateLimiter = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();
  
  return (identifier) => {
    const now = Date.now();
    const userAttempts = attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return {
        allowed: false,
        resetTime: recentAttempts[0] + windowMs
      };
    }
    
    // Add current attempt
    recentAttempts.push(now);
    attempts.set(identifier, recentAttempts);
    
    return {
      allowed: true,
      remaining: maxAttempts - recentAttempts.length
    };
  };
};