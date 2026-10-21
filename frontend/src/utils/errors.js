export const getErrorMessage = (err) =>
  err.response?.data?.message || 'Something went wrong. Please try again.';

export const getFieldErrors = (err) =>
  Object.fromEntries((err.response?.data?.details ?? []).map((d) => [d.field, d.message]));