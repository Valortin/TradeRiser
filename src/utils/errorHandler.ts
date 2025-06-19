export const extractErrorCode = (error: any): string | null => {
  if (!error) return null;
  const errorMessage = error.message || error.toString();
  const aaMatch = errorMessage.match(/AA(\d\d)/);
  if (aaMatch) return `AA${aaMatch[1]}`;
  const pmMatch = errorMessage.match(/PM(\d\d)/);
  if (pmMatch) return `PM${pmMatch[1]}`;
  return null;
};

export const getReadableErrorMessage = (error: any): string => {
  const errorCode = extractErrorCode(error);
  if (errorCode) return `Error ${errorCode}: Transaction failed. Please try again.`;
  const errorMessage = error.message || error.toString();
  if (errorMessage.includes("insufficient funds")) return "Insufficient funds for transaction.";
  if (errorMessage.includes("execution reverted")) return "Transaction reverted by contract.";
  return errorMessage;
};