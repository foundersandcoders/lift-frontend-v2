// /src/utils/validateEmail.ts
export const validateEmail = (email: string): boolean => {
  // A simple regex for email validation.
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
