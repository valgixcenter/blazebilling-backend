import fastify from 'fastify'
import { port } from './config/app'

const server = fastify()

;(async () =>
{
    
    try
    {
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