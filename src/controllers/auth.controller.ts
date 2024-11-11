import type { FastifyReply, FastifyRequest } from 'fastify'
import type { cSignupRequestType } from '../types/types'
import Validate from '../helpers/validate'
import prisma from '../database/prisma'
import jwt from 'jsonwebtoken'
import hash from '../helpers/hash'

export const cSignup = async (request: FastifyRequest<{Body: cSignupRequestType}>, reply: FastifyReply)=>
{
    let
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
            return reply.send({ code: 400, msg: 'User already exist' })
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

                return reply.send({ code: 200, msg: 'Successfuly', token })
            }
        )
    }

    else
    {
        return reply.send({ code: 400, msg: 'Bad request' })
    }
}