import type { FastifyInstance } from 'fastify'
import { cALogin } from '../../controllers/admin/auth.controller'

export default async (fastify: FastifyInstance)=>
{
    fastify.post(`${process.env.OAUTH_URL}/admin/login`, cALogin)
}
