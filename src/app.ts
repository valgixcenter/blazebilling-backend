import fastify from 'fastify'
import { port } from './config/app'
import fs from 'fs';
import path from 'path';

const server = fastify()

const registerRoutes = async () =>
{
    const routesPath = path.join(__dirname, 'routes')
    const files = fs.readdirSync(routesPath)
    const routeFiles = files.filter(file => file.endsWith('.ts'))

    for (const file of routeFiles)
    {
        const filePath = path.join(routesPath, file)
        const routesModule = await import(filePath)
        
        if (typeof routesModule.default === 'function')
        {
            server.register(routesModule.default)
        }
    }
}

;(async () =>
{
    
    try
    {
        await registerRoutes()

        server.listen({ port }, (err, address) =>
        {
            if (err)
            {
                console.error(err)
                process.exit(1)
            }

            console.log(`Hello Valgix, app listening at ${address}`)
        })
    }
    
    catch (error)
    {
        console.log(error)
    }

})
()