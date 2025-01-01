import type { FastifyReply, FastifyRequest } from 'fastify'
import type { cSignupRequestType, cLoginRequestType } from '../../types/types'
import prisma from '../../database/prisma'
import jwt from 'jsonwebtoken'
import hash from '../../helpers/hash'
import { userSchema } from '../../schemas/user.schema'

export const cALogin = async (request: FastifyRequest<{Body: cLoginRequestType}>, reply: FastifyReply)=>
{
    const
    {
        email,
        password
    } 
    =request.body

    const { error } = userSchema.validate({ email, password })
    if (error)
    {
        return reply.code(400).send({ code: 400, msg: error.message })
    }

    await prisma.admin.findUnique({ where: { email } })
    .then
    (
        async U=>
        {
            if(!U)
            {
                return reply.code(400).send({ code: 400, msg: 'Admin not found' })
            }

            if(!await new hash({ action: 'compare' }).data(password, U.password))
            {
                return reply.code(400).send({ code: 400, msg: 'Admin not found' })
            }

            await prisma.token.findFirst({ where: { userId: U?.id } })
            .then
            (
                async T=>
                {
                    if((Number(T?.createdAt)+30*24*60*60*1000) > Date.now())
                    {
                        return reply.code(200).send({ code: 200, msg: 'Successfuly logged', token: T?.token })
                    }

                    else
                    {
                        await prisma.token.delete({ where: { token: T?.token }})
                        const token =jwt.sign
                        (
                            {
                                data:
                                {
                                    userId: U?.id,
                                    email: U?.email
                                }
                            }, 
                            process.env.JWT_SECRET
                        )
                        await prisma.token.create
                        (
                            {
                                data: 
                                {
                                    userId: Number(U?.id),
                                    token,
                                    createdAt: Date.now()
                                }
                            }
                        )

                        return reply.code(200).send({ code: 200, msg: 'Successfly logged', token })
                    }
                }
            )
            .catch
            (
                async e=>
                {
                    const token =jwt.sign
                    (
                        {
                            data:
                            {
                                userId: U?.id,
                                email: U?.email
                            }
                        }, 
                        process.env.JWT_SECRET
                    )
                    await prisma.token.create
                    (
                        {
                            data: 
                            {
                                userId: Number(U?.id),
                                token,
                                createdAt: Date.now()
                            }
                        }
                    )

                    return reply.code(200).send({ code: 200, msg: 'Successfly logged', token })
                }
            )
        }
    )
    .catch
    (
        e=>
        {
            return reply.code(400).send({ code: 400, msg: 'Admin not found' })
        }
    )
}