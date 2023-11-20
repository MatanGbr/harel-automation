import { Ora } from 'ora';

export interface Spinner {
    widget: Ora,
    create: (txt: string) => void,
    stop: (success?: boolean) => void
}