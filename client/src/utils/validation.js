/**
 * Validation utility functions for forms across Elite Sports Club
 */

export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Basic phone validation allowing international formats, digits, dashes, brackets, spaces
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
  return phoneRegex.test(phone.trim());
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
};

export const validateBookingTimes = (startTime, endTime) => {
  if (!startTime || !endTime) return 'Start and End times are required';
  if (startTime >= endTime) {
    return 'End time must be after start time';
  }
  return null;
};

export const isFutureDate = (dateString) => {
  if (!dateString) return false;
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};
