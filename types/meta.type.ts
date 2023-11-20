export type Meta = {
    msg: string,
    options: MetaOptions[]
}

export type MetaOptions = {
    name: string[],
    description: string,
    actions: MetaOptionAction[]
}

export type MetaOptionAction = {
    values: string[],
    description: string,
    method: Function
}