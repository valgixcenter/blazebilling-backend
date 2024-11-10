import type { FastifyInstance } from 'fastify'
import { cLogin } from '../controllers/auth.controller'

export default async (fastify: FastifyInstance)=>
{
    fastify.post(`${process.env.OAUTH_URL}/signup`, cLogin)
}
