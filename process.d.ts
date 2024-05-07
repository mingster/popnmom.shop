declare namespace NodeJS {
  export interface ProcessEnv {
    //NEXT_PUBLIC_STORE_ID: string;
    //NEXT_PUBLIC_API_URL: string;
    //NEXT_PUBLIC_BILLBOARD_ID: string;
    //NEXT_PUBLIC_BIGCROSS_PRODUCT_ID: string;
    //NEXT_PUBLIC_SMCROSS_PRODUCT_ID: string;

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET: string;
    NEXT_PUBLIC_CLOUDINARY_APIKEY: string;
    NEXT_PUBLIC_CLOUDINARY_APISECRET: string;

    //planet scale connection string
    DATABASE_URL: string;
    REDIS_URL: string;

    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;

    APPLE_ID: string;
    APPLE_TEAM_ID: string;
    APPLE_PRIVATE_KEY: string;
    APPLE_KEY_ID: string;

    AUTH0_ID: string;
    AUTH0_SECRET: string;
    AUTH0_ISSUER: string;

    FACEBOOK_ID: string;
    FACEBOOK_SECRET: string;

    GITHUB_ID: string;
    GITHUB_SECRET: string;

    GOOGLE_ID: string;
    GOOGLE_SECRET: string;

    TWITTER_ID: string;
    TWITTER_SECRET: string;

    LINE_ID: string;
    LINE_SECRET: string;

    //stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_PUBLIC_KEY: string;
    STRIPE_SECRET_KEY: string;

    //paypal
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: string;
    PAYPAL_CLIENT_SECRET: string;
    PAYPAL_CLIENT_ID: string;
  }
}
