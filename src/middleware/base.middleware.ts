import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify"
import prisma from '../database/prisma'

export async function middleBase(req : FastifyRequest, rep : FastifyReply, done : HookHandlerDoneFunction)
{
}