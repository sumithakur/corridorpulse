import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Allow 5 evaluations per IP per hour
const LIMIT = 5;
const WINDOW_DURATION_MS = 60 * 60 * 1000; // 1 hour

// 1. Upstash Redis Ratelimiter (when environment variables are present)
let upstashRatelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    upstashRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(LIMIT, "1 h"),
      analytics: true,
      prefix: "deal-screener:ratelimit",
    });
  } catch (err) {
    console.warn("Failed to initialize Upstash Redis ratelimiter, using local fallback:", err);
  }
}

// 2. Local In-Memory Sliding Window Fallback (for local development or when Redis is not yet configured)
const inMemoryStore = new Map<string, number[]>();

function checkInMemoryRateLimit(ip: string): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const windowStart = now - WINDOW_DURATION_MS;

  // Clean old entries for this IP
  const timestamps = (inMemoryStore.get(ip) || []).filter((time) => time > windowStart);

  if (timestamps.length >= LIMIT) {
    const oldest = timestamps[0];
    const resetTime = oldest + WINDOW_DURATION_MS;
    return {
      success: false,
      limit: LIMIT,
      remaining: 0,
      reset: resetTime,
    };
  }

  timestamps.push(now);
  inMemoryStore.set(ip, timestamps);

  return {
    success: true,
    limit: LIMIT,
    remaining: LIMIT - timestamps.length,
    reset: now + WINDOW_DURATION_MS,
  };
}

/**
 * Checks whether the client IP has exceeded the 5 requests/hour threshold.
 */
export async function checkRateLimit(ip: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  if (upstashRatelimit) {
    try {
      const result = await upstashRatelimit.limit(ip);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (err) {
      console.warn("Upstash query error, failing over to in-memory check:", err);
      return checkInMemoryRateLimit(ip);
    }
  }

  return checkInMemoryRateLimit(ip);
}
