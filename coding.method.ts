import { copyFile } from 'fs/promises';
import { homedir } from 'os';
import { ampersand } from '../../../../imp/src/methods/text.method.js';
import { VSCODE_Extensions } from '../lists/extensions.list.js';
import { publicDir } from './files.method.js';
import { spinner, itemLog, spinnerPlus, spinnerQuestion } from './msg.js';
import { problems, handleErrors } from './problems.method.js';
import { ps } from './ps.method.js';
import { SNIPPETS } from '../lists/snippets.list.js';

const installVSCodeExtension = async (extension) => {
    try {
        await ps(`code --install-extension ${extension.path}`);
    } catch (err) {
        problems.collect(err);
    }
};

const syncFile = async (src, dest) => {
    try {
        await copyFile(src, dest);
        spinnerPlus(spinner.widget);
    } catch (err) {
        handleErrors(err);
    }
};

export const addVSCodeExtensions = async () => {
    spinner.create(`adding extensions: ${ampersand(VSCODE_Extensions.map(({ name }) => name))}`);

    await Promise.all(VSCODE_Extensions.map(installVSCodeExtension));

    if (problems.check()) {
        spinner.stop();
    } else {
        spinner.stop(false);
        problems.show();
    }
};

export const syncRecommendedSettings = async () => {
    spinner.create(`syncing with recommended settings`);

    try {
        await Promise.all([
            syncFile(`${publicDir}/vscode.json`, `${homedir().toString()}/AppData/Roaming/Code/User/settings.json`),
            syncFile(`${publicDir}/keybindings.json`, `${homedir().toString()}/AppData/Roaming/Code/User/keybindings.json`)
        ]);
    } catch (err) {
        spinner.stop(false);
        handleErrors(err);
        problems.show();
    }
};

export const syncRecommendedSnippets = async () => {
    spinner.create(`syncing recommended code snippets for ${ampersand(SNIPPETS.flatMap(({ langs }) => langs))}`);

    await Promise.all(
        SNIPPETS.map(async ({ file, langs }) => await Promise.all(
            [langs].flat().map(async lang => {
                await syncFile(file, `${homedir().toString()}/AppData/Roaming/Code/User/snippets/${lang}.json`);
            })
        ))
    );

    if (problems.check()) {
        spinner.stop();
    } else {
        spinner.stop(false);
        problems.show();
    }
};
