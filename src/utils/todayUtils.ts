export const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getEndOfToday = () => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
};
