import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const limit = parseInt(process.env.RATE_LIMIT_PER_DAY ?? "5");

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(limit, "1 d"),
});