export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidPassword = (password: string) => password.length >= 6;

export const validateUsername = (username: string) => {
  if (!username.trim()) return 'auth_error_username_required';
  if (username.trim().length < 3) return 'auth_error_username_short';
  return '';
};

export const validateEmail = (email: string) => {
  if (!email.trim()) return 'auth_error_email_required';
  if (!isValidEmail(email)) return 'auth_error_email_invalid';
  return '';
};

export const validatePassword = (password: string) => {
  if (!password) return 'auth_error_password_required';
  if (!isValidPassword(password)) return 'auth_error_password_short';
  return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (confirmPassword !== password) return 'auth_error_confirm_password_match';
  return '';
};
