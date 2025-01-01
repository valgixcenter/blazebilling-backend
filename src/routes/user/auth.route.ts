import type { FastifyInstance } from 'fastify'
import { cSignup, cLogin } from '../../controllers/user/auth.controller'

export default async (fastify: FastifyInstance)=>
{
    fastify.post(`${process.env.OAUTH_URL}/signup`, cSignup)
    fastify.post(`${process.env.OAUTH_URL}/login`, cLogin)
}
