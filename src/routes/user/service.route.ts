import type { FastifyInstance } from 'fastify'
import { middleBase } from '../../middleware/base.middleware'
import { cServiceList, cServiceBuy, cUserServiceList, cUserServiceById } from '../../controllers/user/service.controller'

export default async (fastify: FastifyInstance)=>
{
    fastify.get(`${process.env.API_URL}/service/list`, { preHandler:(rq, rp)=> middleBase(rq, rp) }, cServiceList)
    fastify.get(`${process.env.API_URL}/service/list/own`, { preHandler:(rq, rp)=> middleBase(rq, rp) }, cUserServiceList)
    fastify.get(`${process.env.API_URL}/service/:id`, { preHandler:(rq, rp)=> middleBase(rq, rp) }, cUserServiceById)
    fastify.post(`${process.env.API_URL}/service/buy`, { preHandler:(rq, rp)=> middleBase(rq, rp) }, cServiceBuy)
}