import type { FastifyInstance } from 'fastify'

export default async (fastify: FastifyInstance)=>
{
    fastify.get('/ahealth', (req, res) => {
        res.send({
            status: 'ok'
        })
    })
}
