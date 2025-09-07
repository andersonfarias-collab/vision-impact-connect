// Input sanitization utilities
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  
  // Remove HTML tags and scripts
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  // Basic email sanitization
  return email
    .toLowerCase()
    .trim()
    .replace(/[<>]/g, '');
};

export const sanitizePhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters except + and -
  return phone.replace(/[^0-9+\-\s()]/g, '').trim();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Brazilian phone validation (basic)
  const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};