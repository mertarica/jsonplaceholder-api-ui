interface ErrorDetails {
  message: string;
  code?: string;
  context?: Record<string, any>;
}

class ErrorService {
  private static instance: ErrorService;
  private errorQueue: ErrorDetails[] = [];

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  logError(error: unknown, context?: Record<string, any>): void {
    const errorDetails = this.parseError(error, context);

    if (import.meta.env.DEV) {
      console.group('🚨 Error Log');
      console.error('Message:', errorDetails.message);
      if (errorDetails.code) console.warn('Code:', errorDetails.code);
      if (errorDetails.context) console.table(errorDetails.context);
      console.groupEnd();
    }

    this.errorQueue.push(errorDetails);

    // In production, I would send to error tracking service like Sentry, LogRocket, etc.
    // this.sendToErrorTracking(errorDetails);
  }

  private parseError(
    error: unknown,
    context?: Record<string, any>
  ): ErrorDetails {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: error.name,
        context: { ...context, stack: error.stack },
      };
    }

    return {
      message: String(error),
      context,
    };
  }

  getErrorQueue(): ErrorDetails[] {
    return [...this.errorQueue];
  }

  clearErrorQueue(): void {
    this.errorQueue = [];
  }
}

export const errorService = ErrorService.getInstance();
