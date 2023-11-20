export interface Problems {
    all: string[],
    collect: (problem: string) => void,
    show: () => void,
    clear: () => void,
    check: () => boolean
}