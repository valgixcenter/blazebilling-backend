import type { FastifyInstance, FastifyReply } from 'fastify'
import { cSignup, cLogin } from '../controllers/auth.controller'

export default async (fastify: FastifyInstance)=>
{
    fastify.post(`${process.env.OAUTH_URL}/signup`, cSignup)
    fastify.post(`${process.env.OAUTH_URL}/login`, cLogin)

    
}
