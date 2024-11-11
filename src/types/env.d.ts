declare global
{
    namespace NodeJS
    {
        interface ProcessEnv
        {
            PORT?: string | number;
            NODE_ENV?: 'development' | 'production';
            OAUTH_URL: string;
            BC_HASH: string;
            JWT_SECRET: string;
        }
    }
}
  
  export {};
  