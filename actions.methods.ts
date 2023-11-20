import { BinAction } from '../types/bin.type';
import { color, er, heading, underline } from './msg.js';
import { usrActions } from './usr.method.js';
import Fuse from 'fuse.js';

export const findValidActions = (availableActions: BinAction[], msg: string): void => {
    if (usrActions.length === 0) {
        heading(msg);
        console.log(
            `${availableActions
                .map(({ name, description }) =>
                    `   ${color(underline(`--${name[0].toString()}`))} to ${description}`
                )
                .join(`.\n`)}.\n`
        );
    } else {
        const fuse = new Fuse(availableActions, { keys: ['name'] });
        usrActions.forEach(({ name, values }) => {
            const validAction = fuse.search(name);
            if (validAction.length === 0) {
                er(`could not recognize "${name}".\nYou can run the primary command without attributes for its full list of options`);
            } else {
                findValidOption(validAction[0].item, values, name);
            }
        });
    }
};

const findValidOption = (validAction, optionValues, methodName) => {
    let prompt = false;
    const fuse = new Fuse(validAction.options, { keys: ['values'] });
    const validOption = fuse.search(optionValues.join(''));

    if (validOption.length !== 0) {
        prompt = true;
        const action = validOption[0].item as any;
        action.method();
    } else {
        if (!prompt) {
            heading(`options to ${validAction.description}:`);
            console.log(
                `${validAction.options
                    .map(({ description: valueDescription, values }) =>
                        `   '${color(underline(values[0]))}' to ${valueDescription}`
                    )
                    .join(`.\n`)}.\n`
            );
        } else {
            er(
                `
                could not recognize valid values for "${methodName}".
                you can run this attribute without values for its full list of options
            `
            );
        }
    }
};
