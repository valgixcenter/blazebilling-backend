import type { FastifyReply, FastifyRequest } from 'fastify'
import type { cAServiceAddType } from '../../types/types'
import { serviceAddSchema } from '../../schemas/service.schema'
import prisma from '../../database/prisma'
import fs from 'fs'
import path from 'path'

export const cAServiceAdd = async (request: FastifyRequest<{Body: cAServiceAddType}>, reply: FastifyReply)=>
{
    const { name, price, handler, metadata } = request.body

    const { error } = serviceAddSchema.validate({ name, price, handler, metadata })

    if (error)
    {
        return reply.status(400).send({ code: 400, msg: error.message })
    }

    const modulesPath = path.join(process.cwd(), 'src/modules')
    const servicePath = path.join(modulesPath, handler)
    
    if (!fs.existsSync(servicePath) && handler != 'manual')
    {
        return reply.status(400).send({ code: 400, msg: `Service module with name "${handler}" not exists` })
    }
    
    await prisma.service.create
    ({ 
        data:
        { 
            name, 
            price, 
            handler, 
            metadata: JSON.stringify(metadata), 
            createdAt: parseInt(Date.now().toString()) 
        } 
    })

    return reply.status(200).send({ code: 200, msg: 'Service added successfully' })
}