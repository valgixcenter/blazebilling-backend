import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify"
import prisma from '../database/prisma'
import jwt from 'jsonwebtoken'
import type { JWTtoken } from "../types/interfaces"

declare module 'fastify'
{
    interface FastifyRequest
    {
        user?: JWTtoken;
    }
}

export async function middleBase(req : FastifyRequest, rep : FastifyReply, done : HookHandlerDoneFunction)
{
    if(req.headers['vgx-token'])
    {
        const token = req.headers['vgx-token'].toString()

        await prisma.token.findUnique({ where: { token } })
        .then
        (
            async T=>
            {
                if((Number(T?.createdAt)+30*24*60*60*1000) > Date.now())
                {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTtoken
                    req.user = decoded
                    done()
                }

                else
                {
                    await prisma.token.delete({ where: { token }})
                    return rep.code(401).send({ code: 401, msg: 'Unable find token' })
                }
            }
        )
        .catch
        (
            async e=>
            {
                return rep.code(401).send({ code: 401, msg: 'Unable find token' })
            }
        )
    }

    else
    {
        return rep.code(401).send({ code: 401, msg: 'Unable find token' })
    }
}