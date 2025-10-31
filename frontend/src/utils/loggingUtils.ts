/**
 * Logging utilities
 * Following design principles: Structured logging, observability, performance tracking
 *
 * Responsibility: Provide consistent logging interface for application events
 * Implements design principle: Structured logging with timestamps, context, and request IDs
 */

import type { AppError } from './errorUtils';

/**
 * Log levels
 * Following design principles: Clear categorization
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Log entry interface
 * Following design principles: Structured data, type safety
 */
export interface LogEntry {
  level: LogLevel;
  timestamp: string; // ISO 8601 format
  message: string;
  requestId?: string;
  context?: Record<string, unknown>;
  performance?: PerformanceMetrics;
  error?: AppError;
}

/**
 * Performance metrics interface
 * Following design principles: Track performance as a feature
 */
export interface PerformanceMetrics {
  operation: string;
  durationMs: number;
  startTime: number;
  endTime: number;
  metadata?: Record<string, unknown>;
}

/**
 * Logger configuration
 * Following design principles: Configuration over code
 */
export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enablePerformanceTracking: boolean;
  environment: 'development' | 'production';
}

/**
 * Default logger configuration
 * Following design principles: Sensible defaults
 */
const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: LogLevel.INFO,
  enableConsole: true,
  enablePerformanceTracking: true,
  environment: 'development',
};

/**
 * Logger class
 * Following design principles: Single responsibility, configurable
 */
class Logger {
  private config: LoggerConfig;
  private requestId: string | null = null;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Set request ID for tracking related logs
   * Following design principles: Request tracing
   */
  setRequestId(id: string): void {
    this.requestId = id;
  }

  /**
   * Clear request ID
   */
  clearRequestId(): void {
    this.requestId = null;
  }

  /**
   * Generate a unique request ID
   * Following design principles: UUID for tracking
   */
  generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Create log entry
   * Following design principles: Structured logging, consistent format
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: AppError,
    performance?: PerformanceMetrics
  ): LogEntry {
    return {
      level,
      timestamp: new Date().toISOString(),
      message,
      requestId: this.requestId || undefined,
      context,
      error,
      performance,
    };
  }

  /**
   * Check if log level should be logged
   * Following design principles: Configuration-driven behavior
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const levelIndex = levels.indexOf(level);
    const minLevelIndex = levels.indexOf(this.config.minLevel);
    return levelIndex >= minLevelIndex;
  }

  /**
   * Output log entry
   * Following design principles: Environment-aware logging
   */
  private output(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    if (this.config.enableConsole) {
      /* eslint-disable no-console */
      // Console usage is intentional in logging utility
      const consoleMethod = {
        [LogLevel.DEBUG]: console.log,
        [LogLevel.INFO]: console.log,
        [LogLevel.WARN]: console.warn,
        [LogLevel.ERROR]: console.error,
      }[entry.level];
      /* eslint-enable no-console */

      if (this.config.environment === 'development') {
        // Pretty print for development
        consoleMethod(
          `[${entry.level}] ${entry.timestamp}${entry.requestId ? ` [${entry.requestId}]` : ''}`,
          entry.message,
          entry.context || entry.performance || entry.error || ''
        );
      } else {
        // JSON format for production (easier to parse)
        consoleMethod(JSON.stringify(entry));
      }
    }

    // In production, this could also send to logging service
    // e.g., CloudWatch, DataDog, Sentry, etc.
  }

  /**
   * Log debug message
   * Following design principles: Clear purpose methods
   */
  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.output(entry);
  }

  /**
   * Log info message
   * Following design principles: Clear purpose methods
   */
  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.output(entry);
  }

  /**
   * Log warning message
   * Following design principles: Clear purpose methods
   */
  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    this.output(entry);
  }

  /**
   * Log error message
   * Following design principles: Clear purpose methods
   */
  error(message: string, error?: AppError, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.output(entry);
  }

  /**
   * Track performance of an operation
   * Following design principles: Performance metrics as a feature
   */
  trackPerformance(
    operation: string,
    startTime: number,
    metadata?: Record<string, unknown>
  ): void {
    if (!this.config.enablePerformanceTracking) return;

    const endTime = performance.now();
    const metrics: PerformanceMetrics = {
      operation,
      durationMs: endTime - startTime,
      startTime,
      endTime,
      metadata,
    };

    const entry = this.createLogEntry(
      LogLevel.INFO,
      `Performance: ${operation} completed in ${metrics.durationMs.toFixed(2)}ms`,
      undefined,
      undefined,
      metrics
    );
    this.output(entry);
  }

  /**
   * Create a performance tracker
   * Following design principles: Reusable utility pattern
   */
  startPerformanceTracking(operation: string): PerformanceTracker {
    return new PerformanceTracker(operation, this);
  }
}

/**
 * Performance tracker helper
 * Following design principles: Single responsibility, easy to use
 */
class PerformanceTracker {
  private startTime: number;
  private operation: string;
  private logger: Logger;

  constructor(operation: string, logger: Logger) {
    this.operation = operation;
    this.logger = logger;
    this.startTime = performance.now();
  }

  /**
   * End tracking and log performance
   */
  end(metadata?: Record<string, unknown>): void {
    this.logger.trackPerformance(this.operation, this.startTime, metadata);
  }
}

/**
 * Global logger instance
 * Following design principles: Single source of truth
 */
export const logger = new Logger();

/**
 * Create a scoped logger with request ID
 * Following design principles: Request tracing
 */
export function createScopedLogger(requestId?: string): Logger {
  const scopedLogger = new Logger();
  if (requestId) {
    scopedLogger.setRequestId(requestId);
  } else {
    scopedLogger.setRequestId(scopedLogger.generateRequestId());
  }
  return scopedLogger;
}

/**
 * Decorator for tracking function performance
 * Following design principles: Reusable utility pattern
 */
export function trackPerformance(operation: string) {
  return function <T extends (...args: unknown[]) => unknown>(
    _target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value;
    if (!originalMethod) return descriptor;

    descriptor.value = function (this: unknown, ...args: unknown[]) {
      const tracker = logger.startPerformanceTracking(
        operation || `${String(propertyKey)}`
      );
      try {
        const result = originalMethod.apply(this, args);
        tracker.end();
        return result;
      } catch (error) {
        tracker.end({ error: true });
        throw error;
      }
    } as T;

    return descriptor;
  };
}

