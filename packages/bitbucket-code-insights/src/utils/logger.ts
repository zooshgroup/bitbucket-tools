export function createLogger(packageName: string) {

    return (message: string, additionalInfo?: string) => {

      const formattedInfo = additionalInfo ? ' - ' + additionalInfo : '';

      console.log(`${packageName}${formattedInfo}: ${message}`);
    };
}
  
  