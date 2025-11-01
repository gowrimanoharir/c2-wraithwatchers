/**
 * IP-based Rate Limiting for Supabase
 * 
 * Since Supabase RLS can't directly access request IPs,
 * we implement rate limiting at the application level.
 */

interface RateLimitCheck {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS = 3; // Max 3 submissions per hour per IP

// In-memory store (for serverless, consider Redis or Upstash)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Check if an IP address can make a request
 */
export function checkRateLimit(ip: string): RateLimitCheck {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // No previous requests or window expired
  if (!record || now > record.resetAt) {
    const resetAt = now + RATE_LIMIT_WINDOW;
    rateLimitStore.set(ip, { count: 1, resetAt });
    
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: new Date(resetAt)
    };
  }

  // Within rate limit window
  if (record.count < MAX_REQUESTS) {
    record.count++;
    
    return {
      allowed: true,
      remaining: MAX_REQUESTS - record.count,
      resetAt: new Date(record.resetAt)
    };
  }

  // Rate limit exceeded
  return {
    allowed: false,
    remaining: 0,
    resetAt: new Date(record.resetAt)
  };
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: Request): string {
  // Check various headers for IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const cfConnecting = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    // x-forwarded-for can have multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  if (real) return real;
  if (cfConnecting) return cfConnecting;
  
  return 'unknown';
}

/**
 * Clean up old entries periodically
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(ip);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

