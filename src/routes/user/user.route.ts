import type { FastifyInstance } from 'fastify'
import { middleBase } from '../../middleware/base.middleware'
import { cUserInfo } from '../../controllers/user/user.controller'

export default async (fastify: FastifyInstance)=>
{
    fastify.get(`${process.env.API_URL}/user/info`, { preHandler:(rq, rp, d)=> middleBase(rq, rp, d) }, cUserInfo)
}