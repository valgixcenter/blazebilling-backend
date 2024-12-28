import bc from 'bcrypt'
import type { HashOptionsInterface } from '../types/interfaces'

export default class Hash
{
    action?: string;

    constructor(ops? : HashOptionsInterface)
    {
        this.action = ops?.action
    }

    async data(s : string, hash? : string) : Promise<any | undefined>
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

        if(this.action == 'compare' && hash)
        {
            try
            {
                const compare = await bc.compare(s, hash)
                return compare
            }

            catch(err)
            {
                console.error(err)
                return false
            }
        }
    }
}