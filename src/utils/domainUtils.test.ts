import { describe, it, expect } from "vitest";
import { getDomainFromUrl, isSameDomain } from "./domainUtils";

describe("getDomainFromUrl", () => {
  describe("valid URLs", () => {
    it("should extract hostname from basic URL", () => {
      expect(getDomainFromUrl("https://example.com")).toBe("example.com");
    });

    it("should extract hostname from URL with path", () => {
      expect(getDomainFromUrl("https://example.com/path/to/page")).toBe(
        "example.com"
      );
    });

    it("should extract hostname from URL with query parameters", () => {
      expect(getDomainFromUrl("https://example.com/page?param=value")).toBe(
        "example.com"
      );
    });

    it("should extract hostname from URL with fragment", () => {
      expect(getDomainFromUrl("https://example.com/page#section")).toBe(
        "example.com"
      );
    });

    it("should extract hostname from URL with port", () => {
      expect(getDomainFromUrl("https://example.com:8080/page")).toBe(
        "example.com"
      );
    });

    it("should remove www prefix from hostname", () => {
      expect(getDomainFromUrl("https://www.example.com")).toBe("example.com");
    });

    it("should handle different protocols", () => {
      expect(getDomainFromUrl("http://example.com")).toBe("example.com");
      expect(getDomainFromUrl("https://example.com")).toBe("example.com");
      expect(getDomainFromUrl("ftp://example.com")).toBe("example.com");
    });

    it("should handle subdomains", () => {
      expect(getDomainFromUrl("https://mail.google.com")).toBe(
        "mail.google.com"
      );
      expect(getDomainFromUrl("https://docs.google.com")).toBe(
        "docs.google.com"
      );
    });

    it("should handle www with subdomains", () => {
      expect(getDomainFromUrl("https://www.mail.google.com")).toBe(
        "mail.google.com"
      );
    });
  });

  describe("invalid URLs", () => {
    it("should return null for invalid URL format", () => {
      expect(getDomainFromUrl("not-a-url")).toBe(null);
    });

    it("should return null for empty string", () => {
      expect(getDomainFromUrl("")).toBe(null);
    });

    it("should return null for malformed URLs", () => {
      expect(getDomainFromUrl("http://")).toBe(null);
      expect(getDomainFromUrl("https://")).toBe(null);
      expect(getDomainFromUrl("://example.com")).toBe(null);
    });

    it("should return null for URLs with invalid characters", () => {
      expect(getDomainFromUrl("https://exam ple.com")).toBe(null);
    });
  });
});

describe("isSameDomain", () => {
  describe("same domain scenarios", () => {
    it("should return true for identical URLs", () => {
      const url = "https://example.com/page";
      expect(isSameDomain(url, url)).toBe(true);
    });

    it("should return true for same domain with different paths", () => {
      expect(
        isSameDomain("https://example.com/page1", "https://example.com/page2")
      ).toBe(true);
    });

    it("should return true for same domain with different protocols", () => {
      expect(
        isSameDomain("http://example.com/page", "https://example.com/page")
      ).toBe(true);
    });

    it("should return true for same domain with different ports", () => {
      expect(
        isSameDomain(
          "https://example.com:80/page",
          "https://example.com:8080/page"
        )
      ).toBe(true);
    });

    it("should return true for same domain with different query parameters", () => {
      expect(
        isSameDomain(
          "https://example.com/page?param1=value1",
          "https://example.com/page?param2=value2"
        )
      ).toBe(true);
    });

    it("should return true for same domain with different fragments", () => {
      expect(
        isSameDomain(
          "https://example.com/page#section1",
          "https://example.com/page#section2"
        )
      ).toBe(true);
    });

    it("should return true for www vs non-www versions", () => {
      expect(
        isSameDomain("https://www.example.com/page", "https://example.com/page")
      ).toBe(true);
    });

    it("should return true for non-www vs www versions", () => {
      expect(
        isSameDomain("https://example.com/page", "https://www.example.com/page")
      ).toBe(true);
    });

    it("should return true for both www versions", () => {
      expect(
        isSameDomain(
          "https://www.example.com/page1",
          "https://www.example.com/page2"
        )
      ).toBe(true);
    });

    it("should return true for complex same domain scenarios", () => {
      expect(
        isSameDomain(
          "http://www.example.com:80/path1?param=value#section",
          "https://example.com:8080/path2?different=param#other"
        )
      ).toBe(true);
    });
  });

  describe("different domain scenarios", () => {
    it("should return false for different hostnames", () => {
      expect(
        isSameDomain("https://example.com/page", "https://different.com/page")
      ).toBe(false);
    });

    it("should return false for different subdomains", () => {
      expect(
        isSameDomain(
          "https://mail.google.com/page",
          "https://docs.google.com/page"
        )
      ).toBe(false);
    });

    it("should return false for subdomain vs root domain", () => {
      expect(
        isSameDomain("https://mail.google.com/page", "https://google.com/page")
      ).toBe(false);
    });

    it("should return false for root domain vs subdomain", () => {
      expect(
        isSameDomain("https://google.com/page", "https://mail.google.com/page")
      ).toBe(false);
    });

    it("should return false for completely different domains", () => {
      expect(
        isSameDomain(
          "https://github.com/repo",
          "https://stackoverflow.com/questions"
        )
      ).toBe(false);
    });

    it("should return false for www subdomain vs different subdomain", () => {
      expect(
        isSameDomain(
          "https://www.mail.google.com/page",
          "https://docs.google.com/page"
        )
      ).toBe(false);
    });
  });

  describe("edge cases and error handling", () => {
    it("should return false for null/undefined URLs", () => {
      expect(isSameDomain(null as any, "https://example.com")).toBe(false);
      expect(isSameDomain("https://example.com", null as any)).toBe(false);
      expect(isSameDomain(null as any, null as any)).toBe(false);
      expect(isSameDomain(undefined as any, "https://example.com")).toBe(false);
      expect(isSameDomain("https://example.com", undefined as any)).toBe(false);
    });

    it("should return false for empty strings", () => {
      expect(isSameDomain("", "https://example.com")).toBe(false);
      expect(isSameDomain("https://example.com", "")).toBe(false);
      expect(isSameDomain("", "")).toBe(false);
    });

    it("should return false when one URL is invalid", () => {
      expect(isSameDomain("not-a-url", "https://example.com")).toBe(false);
      expect(isSameDomain("https://example.com", "not-a-url")).toBe(false);
    });

    it("should return false when both URLs are invalid", () => {
      expect(isSameDomain("not-a-url", "also-not-a-url")).toBe(false);
    });

    it("should return false for malformed URLs", () => {
      expect(isSameDomain("http://", "https://example.com")).toBe(false);
      expect(isSameDomain("https://example.com", "https://")).toBe(false);
    });

    it("should handle URLs with special characters gracefully", () => {
      expect(isSameDomain("https://exam ple.com", "https://example.com")).toBe(
        false
      );
    });

    it("should handle chrome:// and extension URLs", () => {
      expect(isSameDomain("chrome://extensions/", "https://example.com")).toBe(
        false
      );
      expect(
        isSameDomain(
          "chrome-extension://abcdef/popup.html",
          "https://example.com"
        )
      ).toBe(false);
    });
  });

  describe("real-world scenarios", () => {
    it("should handle GitHub navigation within same domain", () => {
      expect(
        isSameDomain(
          "https://github.com/user/repo",
          "https://github.com/user/repo/issues"
        )
      ).toBe(true);
    });

    it("should handle Google services as different domains", () => {
      expect(
        isSameDomain("https://mail.google.com", "https://docs.google.com")
      ).toBe(false);
    });

    it("should handle www variations in real domains", () => {
      expect(
        isSameDomain(
          "https://www.stackoverflow.com/questions",
          "https://stackoverflow.com/users"
        )
      ).toBe(true);
    });

    it("should handle protocol upgrades", () => {
      expect(
        isSameDomain(
          "http://example.com/login",
          "https://example.com/dashboard"
        )
      ).toBe(true);
    });

    it("should handle port variations", () => {
      expect(
        isSameDomain("http://localhost:3000/app", "http://localhost:8080/api")
      ).toBe(true);
    });
  });
});
