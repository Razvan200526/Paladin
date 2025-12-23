export const isPhoneValid = (phone: string): boolean => {
  // Simple regex for phone validation: allows +, spaces, dashes, brackets, and digits
  // Min length 7, max length 20 to accommodate various formats
  const phoneRegex = /^[+]?[\d\s-()]{7,20}$/;
  return phoneRegex.test(phone.trim());
};
