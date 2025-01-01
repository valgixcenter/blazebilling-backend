import type { FastifyInstance } from 'fastify'
import { middleBase } from '../../middleware/base.middleware'
import { cAServiceAdd } from '../../controllers/admin/service.controller'

export default async (fastify: FastifyInstance)=>
{
    fastify.post(`${process.env.ADMIN_API_URL}/service/add`, { preHandler:(rq, rp)=> middleBase(rq, rp) }, cAServiceAdd)
}