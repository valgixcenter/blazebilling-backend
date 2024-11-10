import type { FastifyInstance } from 'fastify'
import { cHealth } from '../controllers/health.controller'

export default async (fastify: FastifyInstance)=>
{
    fastify.get('/health', cHealth)
}
