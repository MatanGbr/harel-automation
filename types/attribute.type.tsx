export interface Attribute {
    path: string,
    options: AttributeOption[]
}

export interface AttributeOption {
    name: string,
    values: string[]
}