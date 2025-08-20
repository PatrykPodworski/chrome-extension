export const isToday = (timestamp: number): boolean => {
  const today = new Date();
  const timestampDate = new Date(timestamp);

  // Compare year, month, and day in local timezone
  return (
    today.getFullYear() === timestampDate.getFullYear() &&
    today.getMonth() === timestampDate.getMonth() &&
    today.getDate() === timestampDate.getDate()
  );
};
