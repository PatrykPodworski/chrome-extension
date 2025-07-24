export const isTrackableUrl = (url: string | undefined): url is string => {
  return (
    !!url &&
    !url.startsWith("chrome://") &&
    !url.startsWith("chrome-extension://")
  );
};
