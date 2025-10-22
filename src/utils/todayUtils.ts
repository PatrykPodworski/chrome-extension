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

export const isToday = (timestamp: number): boolean => {
  const today = getStartOfToday();
  const timestampDate = new Date(timestamp);

  // Compare year, month, and day in local timezone
  return (
    today.getFullYear() === timestampDate.getFullYear() &&
    today.getMonth() === timestampDate.getMonth() &&
    today.getDate() === timestampDate.getDate()
  );
};
