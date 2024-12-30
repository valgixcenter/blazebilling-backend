import type { FastifyInstance } from 'fastify'
import { cHealth } from '../../controllers/user/health.controller'

export default async (fastify: FastifyInstance)=>
{
    fastify.get('/health', cHealth)
}
