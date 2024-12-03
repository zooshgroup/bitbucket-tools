export function createLogger(packageName: string) {
  const formatMessage = (message: string, additionalInfo?: string) => {
    const formattedInfo = additionalInfo ? ' - ' + additionalInfo : '';
    return `${packageName}${formattedInfo}: ${message}`;
  };

  return {
    log: (message: string, additionalInfo?: string) => {
      console.log(formatMessage(message, additionalInfo));
    },
    error: (message: string, additionalInfo?: string) => {
      const errorMessage = formatMessage(message, additionalInfo);
      throw new Error(errorMessage);
    }
  };
}