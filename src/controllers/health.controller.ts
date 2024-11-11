import type { FastifyReply, FastifyRequest } from 'fastify'

export const cHealth = async (request: FastifyRequest, reply: FastifyReply)=>
{
    reply.send('Im live')
}