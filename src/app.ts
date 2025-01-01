import fastify from 'fastify'
import { port } from './config/app'
import fs from 'fs';
import path from 'path';

const server = fastify()

const registerRoutes = async () =>
{
    const routesPath = path.join(__dirname, 'routes')
    
    const getAllRouteFiles = (dirPath: string): string[] => 
    {
        const files = fs.readdirSync(dirPath)
        let routeFiles: string[] = []
        
        for (const file of files)
        {
            const fullPath = path.join(dirPath, file)
            
            if (fs.statSync(fullPath).isDirectory()) 
            {
                routeFiles = routeFiles.concat(getAllRouteFiles(fullPath))
            } 
            
            else if (file.endsWith('.ts'))
            {
                routeFiles.push(fullPath)
            }
        }
        
        return routeFiles
    }

    const routeFiles = getAllRouteFiles(routesPath)

    for (const filePath of routeFiles)
    {
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