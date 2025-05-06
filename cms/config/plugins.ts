// plugins.ts
module.exports = ({env}) => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-oss',
      providerOptions: {
        accessKeyId: env('ALIYUN_ACCESS_KEY_ID'),
        accessKeySecret: env('ALIYUN_ACCESS_KEY_SECRET'),
        region: env('ALIYUN_BUCKET_REGION'),
        bucket: env('ALIYUN_BUCKET_NAME'),
        uploadPath: env('UPLOAD_PATH'),
        baseUrl: env('ALIYUN_OSS_BASE_URL'),
        timeout: env.int('TIMEOUT', 60000), // Increased timeout (60 seconds)
        secure: env.bool('OSS_SECURE', process.env.NODE_ENV === "production"), // Explicitly set to false if having TLS issues
        internal: env.bool('OSS_INTERNAL', false),
        bucketParams: {
          ACL: 'public-read',
          signedUrlExpires: 60 * 60
        },
        // Add connection options to handle network issues
        connectionOptions: {
          timeout: 60000,
          keepAlive: true,
          keepAliveMsecs: 1000,
        }
      }
    }
  },
  'strapi-cache': {
    enabled: true,
    config: {
      debug: false, // Enable debug logs
      max: 1000, // Maximum number of items in the cache (only for memory cache)
      ttl: 60, // Time to live for cache items unite: seconds
      size: 1024 * 1024 * 1024, // Maximum size of the cache (1 GB) (only for memory cache)
      allowStale: false, // Allow stale cache items (only for memory cache)
      cacheableRoutes: [], // Caches routes which start with these paths (if empty array, all '/api' routes are cached)
      provider: 'redis', // Cache provider ('memory' or 'redis')
      redisUrl: env('REDIS_URL', 'redis://localhost:6379'), // Redis URL (if using Redis)
    },
  }
});
