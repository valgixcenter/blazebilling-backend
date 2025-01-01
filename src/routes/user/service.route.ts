import type { FastifyInstance } from 'fastify'
import { middleBase } from '../../middleware/base.middleware'
import { cServiceList, cServiceBuy, cUserServiceList } from '../../controllers/user/service.controller'

export default async (fastify: FastifyInstance)=>
{
    fastify.get(`${process.env.API_URL}/service/list`, { preHandler:(rq, rp)=> middleBase(rq, rp) }, cServiceList)
    fastify.get(`${process.env.API_URL}/service/list/own`, { preHandler:(rq, rp)=> middleBase(rq, rp) }, cUserServiceList)
    fastify.post(`${process.env.API_URL}/service/buy`, { preHandler:(rq, rp)=> middleBase(rq, rp) }, cServiceBuy)
}