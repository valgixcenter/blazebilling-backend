import type { FastifyReply, FastifyRequest } from 'fastify'
import type { cSignupRequestType, cLoginRequestType } from '../types/types'
import Validate from '../helpers/validate'
import prisma from '../database/prisma'
import jwt from 'jsonwebtoken'
import hash from '../helpers/hash'

export const cSignup = async (request: FastifyRequest<{Body: cSignupRequestType}>, reply: FastifyReply)=>
{
    const
    {
        email,
        password
    } 
    =request.body
    
    if(new Validate({must: 'email'}).condition(email) && password.length >= 8 && password.length <= 32)
    {
        const user = await prisma.user.findUnique({ where: { email } })

        if(user)
        {
            return reply.code(400).send({ code: 400, msg: 'User already exist' })
        }

        await prisma.user.create
        (
            {
                data: {
                    email,
                    password: await new hash({ action: 'hash' }).data(password) ||'',
                    balance: 0.00,
                    createdAt: Date.now()
                }
            }
        )

        .then
        (
            async r=>
            {
                const token =jwt.sign
                (
                    {
                        data:
                        {
                            id: r.id,
                            email
                        }
                    }, 
                    process.env.JWT_SECRET
                )

                await prisma.token.create
                (
                    {
                        data: {
                            owner: r.id,
                            token,
                            createdAt: Date.now()
                        }
                    }
                )

                return reply.code(200).send({ code: 200, msg: 'Successfuly', token })
            }
        )
    }

    else
    {
        return reply.code(400).send({ code: 400, msg: 'Bad request' })
    }
}

export const cLogin = async (request: FastifyRequest<{Body: cLoginRequestType}>, reply: FastifyReply)=>
{
    const
    {
        email,
        password
    } 
    =request.body

    if(new Validate({must: 'email'}).condition(email) && password)
    {
        await prisma.user.findUnique({ where: { email } })
        .then
        (
            async U=>
            {
                await prisma.token.findUnique({ where: { owner: U?.id } })
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
                                        id: U?.id,
                                        email: U?.email
                                    }
                                }, 
                                process.env.JWT_SECRET
                            )
                            await prisma.token.create
                            (
                                {
                                    data: {
                                        owner: Number(U?.id),
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
                                    id: U?.id,
                                    email: U?.email
                                }
                            }, 
                            process.env.JWT_SECRET
                        )
                        await prisma.token.create
                        (
                            {
                                data: {
                                    owner: Number(U?.id),
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
                return reply.code(400).send({ code: 400, msg: 'User not found' })
            }
        )
    }

    else
    {
        return reply.code(400).send({ code: 400, msg: 'Bad request' })
    }
}