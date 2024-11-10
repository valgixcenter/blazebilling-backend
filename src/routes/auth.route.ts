import type { FastifyInstance } from 'fastify'
import { cSignup } from '../controllers/auth.controller'

export default async (fastify: FastifyInstance)=>
{
    fastify.post(`${process.env.OAUTH_URL}/signup`, cSignup)
}
