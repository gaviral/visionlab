/**
 * Error handling utilities
 * Following design principles: Structured errors, user-friendly messages, type safety
 *
 * Responsibility: Create and format errors consistently across the application
 * Implements design principle: Structured error format with codes, messages, and context
 */

/**
 * Error severity levels
 * Following design principles: Clear categorization
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Application error codes
 * Following design principles: Explicit error categorization
 */
export enum ErrorCode {
  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_OBJECT_TYPE = 'INVALID_OBJECT_TYPE',
  INVALID_POSITION = 'INVALID_POSITION',
  
  // File operation errors
  FILE_LOAD_ERROR = 'FILE_LOAD_ERROR',
  FILE_PARSE_ERROR = 'FILE_PARSE_ERROR',
  FILE_SAVE_ERROR = 'FILE_SAVE_ERROR',
  
  // Scene errors
  OBJECT_NOT_FOUND = 'OBJECT_NOT_FOUND',
  PATH_NOT_FOUND = 'PATH_NOT_FOUND',
  INVALID_PATH = 'INVALID_PATH',
  
  // Simulation errors
  SIMULATION_ERROR = 'SIMULATION_ERROR',
  COLLISION_DETECTED = 'COLLISION_DETECTED',
  
  // Camera/Vision errors
  CAMERA_CONFIG_ERROR = 'CAMERA_CONFIG_ERROR',
  VISION_CALCULATION_ERROR = 'VISION_CALCULATION_ERROR',
  
  // API/Backend errors
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // Generic
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Structured error interface
 * Following design principles: Consistent error structure, type safety
 */
export interface AppError {
  code: ErrorCode;
  message: string; // User-friendly message
  severity: ErrorSeverity;
  details?: string; // Technical details (for logging/debugging)
  timestamp: number;
  context?: Record<string, unknown>; // Additional context
}

/**
 * API response format
 * Following design principles: Consistent response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: AppError;
}

/**
 * Create a structured error
 * Following design principles: Pure function, reusable utility
 */
export function createError(
  code: ErrorCode,
  message: string,
  severity: ErrorSeverity = 'error',
  details?: string,
  context?: Record<string, unknown>
): AppError {
  return {
    code,
    message,
    severity,
    details,
    timestamp: Date.now(),
    context,
  };
}

/**
 * Create a validation error
 * Following design principles: Specialized error creators for common cases
 */
export function createValidationError(
  message: string,
  field?: string
): AppError {
  return createError(
    ErrorCode.INVALID_INPUT,
    message,
    'warning',
    field ? `Validation failed for field: ${field}` : undefined,
    field ? { field } : undefined
  );
}

/**
 * Create a file operation error
 * Following design principles: Specialized error creators for common cases
 */
export function createFileError(
  operation: 'load' | 'parse' | 'save',
  message: string,
  technicalDetails?: string
): AppError {
  const codeMap = {
    load: ErrorCode.FILE_LOAD_ERROR,
    parse: ErrorCode.FILE_PARSE_ERROR,
    save: ErrorCode.FILE_SAVE_ERROR,
  };

  return createError(
    codeMap[operation],
    message,
    'error',
    technicalDetails
  );
}

/**
 * Create a scene error
 * Following design principles: Specialized error creators for common cases
 */
export function createSceneError(
  message: string,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
  context?: Record<string, unknown>
): AppError {
  return createError(code, message, 'error', undefined, context);
}

/**
 * Create an API error
 * Following design principles: Specialized error creators for common cases
 */
export function createApiError(
  message: string,
  technicalDetails?: string
): AppError {
  return createError(
    ErrorCode.API_ERROR,
    message,
    'error',
    technicalDetails
  );
}

/**
 * Format error for display to user
 * Following design principles: User-friendly messages, hide technical details
 */
export function formatErrorForUser(error: AppError): string {
  const severityPrefix = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    critical: '🚨',
  };

  return `${severityPrefix[error.severity]} ${error.message}`;
}

/**
 * Format error for logging
 * Following design principles: Structured logging, include all context
 */
export function formatErrorForLog(error: AppError): string {
  return JSON.stringify({
    ...error,
    timestamp: new Date(error.timestamp).toISOString(),
  }, null, 2);
}

/**
 * Create success response
 * Following design principles: Consistent API response format
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Create error response
 * Following design principles: Consistent API response format
 */
export function createErrorResponse(error: AppError): ApiResponse {
  return {
    success: false,
    error,
  };
}

/**
 * Convert native Error to AppError
 * Following design principles: Handle external errors consistently
 */
export function fromNativeError(
  error: Error,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
  userMessage?: string
): AppError {
  return createError(
    code,
    userMessage || 'An unexpected error occurred',
    'error',
    error.message,
    { stack: error.stack }
  );
}

