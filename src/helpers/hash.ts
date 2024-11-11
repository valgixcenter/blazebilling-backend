import bc from 'bcrypt'
import type { HashOptionsInterface } from '../types/interfaces'

export default class Hash
{
    action?: string;

    constructor(ops? : HashOptionsInterface)
    {
        this.action = ops?.action
    }

    async data(s : string) : Promise<string | undefined>
    {
        if(this.action == 'hash')
        {
            try
            {
                const hash = await bc.hash(s, parseInt(process.env.BC_HASH as string, 10) || 10)
                return hash
            }
            
            catch(err)
            {
                console.error(err)
                return undefined
            }
        }
    }
}