import type { FastifyInstance } from 'fastify'
import hash from '../../helpers/hash'

export default async (fastify: FastifyInstance)=>
{
    fastify.get('/ahealth', (req, res) => {
        res.send({
            status: 'ok'
        })
    })

    fastify.post('/hash', async (req, res) => {
        const { data } = req.body as { data: string }
        res.send({
            data: await new hash({ action: 'hash' }).data(data)
        })
    })
}
