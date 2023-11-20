export type typeServeSpecialOptions = {
    name: string,
    description: string,
    values: null | {
        multiple: boolean,
        accept: (number | string)[]
    }
    method: Function
}[]