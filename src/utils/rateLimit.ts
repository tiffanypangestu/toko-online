const ipCache = new Map<string, { count: number; resetTime: number }>();

/**
 * Checks if a specific client IP address has exceeded request limits.
 * Uses an in-memory sliding window cache.
 * 
 * @param ip Client IP Address
 * @param limit Maximum allowed requests in the window
 * @param windowMs Time window in milliseconds (default 1 minute)
 * @returns boolean true if rate limited, false otherwise
 */
export function isRateLimited(ip: string, limit = 15, windowMs = 60000): boolean {
  const now = Date.now();
  const cached = ipCache.get(ip);

  if (!cached) {
    ipCache.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > cached.resetTime) {
    ipCache.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  cached.count += 1;
  if (cached.count > limit) {
    return true;
  }

  return false;
}
