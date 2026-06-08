function isDebugEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEBUG_LOGS === 'true';
}

export const logger = {
  debug: (...args: unknown[]): void => {
    if (isDebugEnabled()) {
      console.debug(...args);
    }
  },
  warn: (...args: unknown[]): void => {
    console.warn(...args);
  },
  error: (...args: unknown[]): void => {
    console.error(...args);
  },
};
