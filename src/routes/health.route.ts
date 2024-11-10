import type { FastifyInstance } from 'fastify'
import { routeHealth } from '../controllers/health.controller'

export default async (fastify: FastifyInstance)=>
{
    fastify.get('/health', routeHealth)
}
