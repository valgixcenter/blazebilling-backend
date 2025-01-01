import type { FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../database/prisma'
import type { cServiceBuyType } from '../../types/types'
import { serviceBuySchema } from '../../schemas/service.schema'
import path from 'path'
import fs from 'fs'

export const cServiceList = async (request: FastifyRequest, reply: FastifyReply)=>
{
    const services = await prisma.service.findMany()
    return reply.status(200).send
    (
        { 
            code: 200,
            msg: 'Services fetched successfully', 
            data: services.map
            (
                service=>
                (
                    {
                        ...service,
                        createdAt: Number(service.createdAt),
                        metadata: service.metadata ? JSON.parse(service.metadata) : null
                    }
                )
            )
        }

    )
}

export const cServiceBuy = async (request: FastifyRequest<{ Body: cServiceBuyType }>, reply: FastifyReply)=>
{
    const { serviceId } = request.body

    const service = await prisma.service.findUnique({ where: { id: serviceId } })
    const user = await prisma.user.findUnique({ where: { id: request.user?.data.userId } })
    const { error } = serviceBuySchema.validate({ serviceId })
    let handler_status = true

    if (error)
    {
        return reply.status(400).send({ code: 400, msg: error.message })
    }

    if (!service)
    {
        return reply.status(404).send({ code: 404, msg: 'Service not found' })
    }

    if (!user)
    {
        return reply.status(404).send({ code: 404, msg: 'User not found' })
    }

    if (user.balance < service.price)
    {
        return reply.status(400).send({ code: 400, msg: 'Insufficient balance' })
    }

    if(service.handler != 'manual')
    {
        const modulePath = path.join(__dirname, '../../modules', service.handler)
        if (!fs.existsSync(modulePath)) 
        {
            return reply.status(404).send({ code: 404, msg: 'Service handler module not found' })
        }
    
        const { index } = require(modulePath+'/index')
        handler_status = await index(service)
    }

    if(!handler_status)
    {
        return reply.status(400).send({ code: 400, msg: 'Service handler failed' })
    }

    await prisma.user.update({ where: { id: user.id }, data: { balance: user.balance-service.price } })

    await prisma.userService.create
    (
        {
            data: {
                userId: user.id,
                createdAt: BigInt(Date.now()),
                metadata: JSON.stringify
                (
                    {
                        serviceId: service.id,
                        serviceName: service.name,
                        servicePrice: service.price,
                        serviceHandler: service.handler,
                        ...(service.metadata ? JSON.parse(service.metadata) : {})
                    }
                )
            }
        }
    )

    return reply.status(200).send({ code: 200, msg: 'Service bought successfully' })
}

export const cUserServiceList = async (request: FastifyRequest, reply: FastifyReply)=>
{
    const userServices = await prisma.userService.findMany({ where: { userId: request.user?.data.userId } })
    
    return reply.status(200).send
    (
        { 
            code: 200, 
            msg: 'User services fetched successfully', 
            data: userServices.map
            (
                userService=>
                (
                    {
                        ...userService, 
                        metadata: userService.metadata ? JSON.parse(userService.metadata) : null,
                        createdAt: Number(userService.createdAt) 
                    }
                )
            ) 
        }
    )
}

export const cUserServiceById = async (request: FastifyRequest, reply: FastifyReply)=>
{
    const { id } = request.params as { id: string }
    const userServices = await prisma.userService.findMany({ where: { userId: request.user?.data.userId, id: parseInt(id) } })

    if(userServices.length == 0)
    {
        return reply.status(404).send({ code: 404, msg: 'User service not found' })
    }
    
    return reply.status(200).send
    (
        { 
            code: 200, 
            msg: 'User services fetched successfully', 
            data: userServices.map
            (
                userService=>
                (
                    {
                        ...userService, 
                        metadata: userService.metadata ? JSON.parse(userService.metadata) : null,
                        createdAt: Number(userService.createdAt) 
                    }
                )
            ) 
        }
    )
}