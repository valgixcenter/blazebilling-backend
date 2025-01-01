export type cSignupRequestType=
{
    email: string;
    password: string;
}

export type cLoginRequestType=
{
    email: string;
    password: string;
}

export type cAServiceAddType=
{
    name: string;
    price: number;
    handler: string;
    metadata?: object;
}

export type validateHelperType=
{
    must: string;
}

export type cServiceBuyType=
{
    serviceId: number;
}