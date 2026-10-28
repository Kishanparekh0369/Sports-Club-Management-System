import dayjs from 'dayjs';

export const formatDate = (date, format = 'MMM D, YYYY') => {
  if (!date) return 'N/A';
  return dayjs(date).format(format);
};

export const formatDateTime = (date, format = 'MMM D, YYYY h:mm A') => {
  if (!date) return 'N/A';
  return dayjs(date).format(format);
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  return timeStr;
};
