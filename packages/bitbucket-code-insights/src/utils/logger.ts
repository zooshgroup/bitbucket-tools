export function createLogger(packageName: string) {
  const formatMessage = (message: string, additionalInfo?: string) => {
    const formattedInfo = additionalInfo ? ` - ${additionalInfo}` : '';
    return `[${new Date().toISOString()}] ${packageName}${formattedInfo}: ${message}`;
  };

  return {
    log: (message: string, additionalInfo?: string) => {
      console.log(formatMessage(message, additionalInfo));
    },
    warn: (message: string, additionalInfo?: string) => {
      console.warn(formatMessage(`WARNING: ${message}`, additionalInfo));
    },
    error: (message: string, additionalInfo?: string) => {
      console.error(formatMessage(`ERROR: ${message}`, additionalInfo));
    },
    critical: (message: string, additionalInfo?: string) => {
      const formattedMessage = formatMessage(`CRITICAL: ${message}`, additionalInfo);
      console.error(formattedMessage);
      throw new Error(formattedMessage);
    },
  };
}
