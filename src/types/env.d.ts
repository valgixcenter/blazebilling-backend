declare global
{
    namespace NodeJS
    {
        interface ProcessEnv
        {
            PORT?: string | number;
            NODE_ENV?: 'development' | 'production';
            API_URL: string;
            OAUTH_URL: string;
            BC_HASH: string;
            JWT_SECRET: string;
        }
    }
}
  
export {};
  