declare global
{
    namespace NodeJS
    {
        interface ProcessEnv
        {
            PORT?: string | number;
            NODE_ENV?: 'development' | 'production';
            OAUTH_URL: string;
        }
    }
}
  
  export {};
  