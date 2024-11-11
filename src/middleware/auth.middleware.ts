import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify"

export async function mLogin(req : FastifyRequest, rep : FastifyReply, done : HookHandlerDoneFunction)
{
    rep.send('Auth "LOGIN" middleware')
}