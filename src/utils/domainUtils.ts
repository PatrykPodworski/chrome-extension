/**
 * Domain utility functions for comparing and extracting domain information from URLs
 */

/**
 * Extracts normalized hostname from a URL
 * Removes 'www.' prefix and handles URL parsing errors gracefully
 * @param url - The URL to extract normalized hostname from
 * @returns Normalized hostname or null if URL is invalid
 */
export function getDomainFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    // Remove 'www.' prefix if present
    return hostname.startsWith("www.") ? hostname.substring(4) : hostname;
  } catch {
    // Return null for invalid URLs
    return null;
  }
}

/**
 * Compares two URLs to determine if they belong to the same domain
 * Ignores protocol differences, port differences, paths, query parameters, and fragments
 * Treats www and non-www versions as the same domain
 *
 * @param url1 - First URL to compare
 * @param url2 - Second URL to compare
 * @returns true if URLs belong to the same domain, false otherwise
 */
export function isSameDomain(url1: string, url2: string): boolean {
  // Handle null/undefined/empty URLs
  if (!url1 || !url2) {
    return false;
  }

  // If URLs are identical, they're definitely the same domain
  if (url1 === url2) {
    return true;
  }

  const normalizedHostname1 = getDomainFromUrl(url1);
  const normalizedHostname2 = getDomainFromUrl(url2);

  // If either URL is invalid, treat as different domains
  if (!normalizedHostname1 || !normalizedHostname2) {
    return false;
  }

  // Compare normalized hostnames
  return normalizedHostname1 === normalizedHostname2;
}
