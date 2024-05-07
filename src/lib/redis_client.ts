import Redis, { RedisOptions } from 'ioredis';

//https://github.com/redis/ioredis
//https://makerkit.dev/blog/tutorials/nextjs-redis
export function createRedisInstance() {
  try {
    /*
    const options: RedisOptions = {
      //  protocol: 'rediss',
      host: 'apn1-tidy-pup-33146.upstash.io',
      port: 33146,
      password: 'fdb6bbdcf4e94f89a4c3f540bd0774bc',
      //tls: true,
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      retryStrategy: (times: number) => {
        if (times > 3) {
          throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }

        return Math.min(times * 200, 1000);
      },
    };
    const redis = new Redis(options);
    */
    const redis = new Redis(process.env.REDIS_URL);
    
    redis.on('error', (error: unknown) => {
      console.warn('[Redis] Error connecting', error);
    });

    return redis;
  } catch (e) {
    throw new Error(`[Redis] Could not create a Redis instance`);
  }
}
