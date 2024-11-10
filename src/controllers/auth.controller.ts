import type { FastifyReply, FastifyRequest } from 'fastify'
import type { cLoginRequestType } from '../types/types'
import Validate from '../helpers/validate'

export const cLogin = async (request: FastifyRequest<{Body: cLoginRequestType}>, reply: FastifyReply)=>
{
    const { email, password } = request.body
    
    if(new Validate({must: 'email'}).condition(email))
    {
        console.log('To be continued')
    }
}