import type { FastifyReply, FastifyRequest } from 'fastify'
import type { cSignupRequestType } from '../types/types'
import Validate from '../helpers/validate'

export const cSignup = async (request: FastifyRequest<{Body: cSignupRequestType}>, reply: FastifyReply)=>
{
    const
    {
        email,
        password
    } 
    =request.body
    
    if(new Validate({must: 'email'}).condition(email) && password.length >= 8)
    {
        console.log('To be continued')
    }

    else
    {
        return reply.send({ code: 400, msg: 'Bad request' })
    }
}