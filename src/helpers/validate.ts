import type { validateHelperType } from '../types/types'

export default class Validate {

    must: string;

    constructor(ops : validateHelperType) {
        this.must = ops.must
    }

    condition(string : string) {

        if(this.must == 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return emailRegex.test(string)
        }
        
    }

}