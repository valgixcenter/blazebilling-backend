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

export async function middleBase(req: FastifyRequest, rep: FastifyReply) {
    try {
        if (!req.headers['vgx-token'])
        {
            return rep.code(401).send({ code: 401, msg: 'Unable to find token' });
        }

        const token = req.headers['vgx-token'].toString();
        const tokenRecord = await prisma.token.findUnique({ where: { token } });

        if (!tokenRecord)
        {
            return rep.code(401).send({ code: 401, msg: 'Unable to find token' });
        }

        if ((Number(tokenRecord.createdAt) + 30 * 24 * 60 * 60 * 1000) <= Date.now())
        {
            await prisma.token.delete({ where: { token } });
            return rep.code(401).send({ code: 401, msg: 'Token expired' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTtoken;
        req.user = decoded;
    } catch (error) {
        return rep.code(401).send({ code: 401, msg: 'Invalid token' });
    }
}