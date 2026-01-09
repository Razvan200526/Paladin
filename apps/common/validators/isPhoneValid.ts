export const isPhoneValid = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s-()]{7,20}$/;
  return phoneRegex.test(phone.trim());
};
