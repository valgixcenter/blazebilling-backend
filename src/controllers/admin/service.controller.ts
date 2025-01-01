import type { FastifyReply, FastifyRequest } from 'fastify'
import type { cAServiceAddType } from '../../types/types'
import { serviceAddSchema } from '../../schemas/service.schema'
import prisma from '../../database/prisma'

export const cAServiceAdd = async (request: FastifyRequest<{Body: cAServiceAddType}>, reply: FastifyReply)=>
{
    const { name, price, handler, metadata } = request.body

    const { error } = serviceAddSchema.validate({ name, price, handler, metadata })

    if (error)
    {
        return reply.status(400).send({ code: 400, msg: error.message })
    }
    
    await prisma.service.create({ data: { name, price, handler, metadata: JSON.stringify(metadata), createdAt: parseInt(Date.now().toString()) } })

    return reply.status(200).send({ code: 200, msg: 'Service added successfully' })
}