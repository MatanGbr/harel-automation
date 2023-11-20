export interface BinAction {
    name: string[],
    description: string,
    options: ActionOption[]
}

export interface ActionOption {
    values: string[],
    description: string,
    method: Function
}