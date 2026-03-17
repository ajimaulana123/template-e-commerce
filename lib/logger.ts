/**
 * Secure Logging Utility
 * Provides environment-aware logging with data sanitization
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'security'

interface LogMeta {
  [key: string]: any
}

// Sensitive field patterns to redact
const SENSITIVE_PATTERNS = [
  'password',
  'token',
  'key',
  'secret',
  'auth',
  'credential',
  'session',
  'cookie',
  'email', // In some contexts
  'phone',
  'ssn',
  'credit',
  'card'
]

/**
 * Sanitize data for logging by redacting sensitive fields
 */
function sanitizeForLogging(data: any): any {
  if (data === null || data === undefined) {
    return data
  }

  if (typeof data === 'string') {
    // Don't log long strings that might contain sensitive data
    if (data.length > 200) {
      return '[LONG_STRING_REDACTED]'
    }
    return data
  }

  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return data.map(item => sanitizeForLogging(item))
    }

    const sanitized: any = {}
    
    for (const [key, value] of Object.entries(data)) {
      const keyLower = key.toLowerCase()
      
      // Check if key contains sensitive patterns
      const isSensitive = SENSITIVE_PATTERNS.some(pattern => 
        keyLower.includes(pattern)
      )
      
      if (isSensitive) {
        sanitized[key] = '[REDACTED]'
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeForLogging(value)
      } else {
        sanitized[key] = value
      }
    }
    
    return sanitized
  }

  return data
}

/**
 * Format log message with timestamp and level
 */
function formatLogMessage(level: LogLevel, message: string, meta?: LogMeta): string {
  const timestamp = new Date().toISOString()
  const metaStr = meta ? ` ${JSON.stringify(sanitizeForLogging(meta))}` : ''
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`
}

/**
 * Check if logging is enabled for the current environment
 */
function isLoggingEnabled(level: LogLevel): boolean {
  const env = process.env.NODE_ENV
  
  // Always log security events
  if (level === 'security') {
    return true
  }
  
  // In production, only log warnings and errors
  if (env === 'production') {
    return ['warn', 'error'].includes(level)
  }
  
  // In development and test, log everything except debug
  if (env === 'development' || env === 'test') {
    return level !== 'debug'
  }
  
  return false
}

/**
 * Secure logger with environment-aware logging and data sanitization
 */
export const logger = {
  /**
   * Log informational messages (development only)
   */
  info: (message: string, meta?: LogMeta) => {
    if (isLoggingEnabled('info')) {
     // console.log(formatLogMessage('info', message, meta))
    }
  },

  /**
   * Log warning messages
   */
  warn: (message: string, meta?: LogMeta) => {
    if (isLoggingEnabled('warn')) {
      console.warn(formatLogMessage('warn', message, meta))
    }
  },

  /**
   * Log error messages with sanitized error details
   */
  error: (message: string, error?: Error | unknown, meta?: LogMeta) => {
    if (isLoggingEnabled('error')) {
      const errorMeta = {
        ...meta,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          // Only include stack in development
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        } : String(error)
      }
      
      console.error(formatLogMessage('error', message, errorMeta))
    }
  },

  /**
   * Log security events (always logged with sanitization)
   */
  security: (event: string, meta?: LogMeta) => {
    const securityMeta = {
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : 'server',
      ...meta
    }
    
    // console.log(formatLogMessage('security', `SECURITY_EVENT: ${event}`, securityMeta))
    
    // In production, also send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with security monitoring service
      // sendToSecurityMonitoring(event, securityMeta)
    }
  },

  /**
   * Log debug messages (development only, when explicitly enabled)
   */
  debug: (message: string, meta?: LogMeta) => {
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_LOGGING === 'true') {
      console.debug(formatLogMessage('debug', message, meta))
    }
  }
}

/**
 * Create a scoped logger with a prefix
 */
export function createScopedLogger(scope: string) {
  return {
    info: (message: string, meta?: LogMeta) => 
      logger.info(`[${scope}] ${message}`, meta),
    
    warn: (message: string, meta?: LogMeta) => 
      logger.warn(`[${scope}] ${message}`, meta),
    
    error: (message: string, error?: Error | unknown, meta?: LogMeta) => 
      logger.error(`[${scope}] ${message}`, error, meta),
    
    security: (event: string, meta?: LogMeta) => 
      logger.security(`[${scope}] ${event}`, meta),
    
    debug: (message: string, meta?: LogMeta) => 
      logger.debug(`[${scope}] ${message}`, meta)
  }
}

/**
 * Utility to sanitize data for logging (exported for manual use)
 */
export { sanitizeForLogging }

/**
 * Common error codes for consistent error handling
 */
export const ErrorCodes = {
  VALIDATION_FAILED: 'E001',
  DATABASE_ERROR: 'E002',
  AUTHENTICATION_FAILED: 'E003',
  AUTHORIZATION_FAILED: 'E004',
  FILE_UPLOAD_FAILED: 'E005',
  NETWORK_ERROR: 'E006',
  RATE_LIMIT_EXCEEDED: 'E007',
  RESOURCE_NOT_FOUND: 'E008',
  INTERNAL_SERVER_ERROR: 'E009'
} as const

/**
 * Create a secure error response with logging
 */
export function createSecureError(
  code: keyof typeof ErrorCodes,
  userMessage: string,
  internalError?: Error | unknown,
  meta?: LogMeta
) {
  // Log the internal error securely
  logger.error(`Error ${ErrorCodes[code]}: ${userMessage}`, internalError, meta)
  
  // Return sanitized error for client
  return {
    code: ErrorCodes[code],
    message: userMessage,
    timestamp: new Date().toISOString()
  }
}