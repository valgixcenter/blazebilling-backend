import type { FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../database/prisma'

export const cUserInfo = async (request: FastifyRequest, reply: FastifyReply)=>
{
    const user = await prisma.user.findUnique({ where: { id: request.user ? parseInt(request.user.data.userId) : undefined } })
    
    const serializedUser=JSON.parse
    (
        JSON.stringify(user, (_, value) => (typeof value === 'bigint' ? Number(value) : value))
    )

    delete serializedUser.password

    return reply.send(serializedUser)
}