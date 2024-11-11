import type { FastifyInstance } from 'fastify'
import { cSignup, cLogin } from '../controllers/auth.controller'
import { mLogin } from '../middleware/auth.middleware'

export default async (fastify: FastifyInstance)=>
{
    fastify.post(`${process.env.OAUTH_URL}/signup`, cSignup)
    fastify.post(`${process.env.OAUTH_URL}/login`, { preHandler:(rq, rp, d)=> mLogin(rq, rp, d) }, cLogin)
}
