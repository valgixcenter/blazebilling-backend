import type { FastifyReply, FastifyRequest } from 'fastify';

export const routeHealth = async (request: FastifyRequest, reply: FastifyReply)=>
{
    reply.send('Im live');
};