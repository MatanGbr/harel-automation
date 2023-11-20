import { homedir } from 'os';
import { resolve } from 'path';
import { argv } from 'process';
import { splitBetweenSigns } from '../../../imp/src/methods/text.method.js';
import { UsrAction, UsrInput } from '../../../imp/src/types/user.type.js';

const fullCommand = argv.slice(2).join(' ').trim();

const getUsrInput = (): UsrInput => {
    const commandParts = fullCommand.split('--');
    const path = resolve(commandParts[0].trim());
    const actions = commandParts.slice(1)
        .map(action => ({
            name: action.split(' ')[0],
            values: splitBetweenSigns(action).slice(1),
        }));

    return { path, actions };
};

const usrData = getUsrInput();

export const targetPath = usrData.path;
export const usrActions = usrData.actions;
export const usrDir = homedir().toString();
