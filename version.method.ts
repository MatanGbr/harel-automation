import { changeJson, checkPkg } from './files.method.js';
import { color, em, er, underline } from './msg.js';
import { problems } from './problems.method.js';
import { targetPath } from './usr.method.js';
import inquirer from 'inquirer';

export const showVr = async (): Promise<void> => {
    try {
        const pkg = await checkPkg(targetPath);
        em('📍', color(underline(pkg.version)));
    } catch (err) {
        handleErrors(err);
    }
};

export const changeVr = async (newVr: string) => {
    const pkg = await checkPkg(targetPath);
    try {
        await changeJson(`${targetPath}/package.json`, { version: newVr });
        em('📜', `Semantic version updated: ${color(underline(pkg.version))} => ${color(underline(newVr))}`);
    } catch (err) {
        handleErrors(err);
    }
};

export const resetVr = async (): Promise<void> => {
    try {
        await changeVr('0.0.0');
    } catch (err) {
        handleErrors(err);
    }
};

export const updateVrByPlace = async (type: 0 | 1 | 2) => {
    try {
        const pkg = await checkPkg(targetPath);
        let vr = pkg.version.split('.').map(place => parseInt(place));
        switch (type) {
            case 2:
                vr = [...vr.slice(0, 2), vr[2] + 1];
                break;
            case 1:
                vr = [vr[0], vr[1] + 1, 0];
                break;
            case 0:
                vr = [vr[0] + 1, 0, 0];
                break;
            default:
                throw `Couldn't update version (wrong value)`;
        }
        await changeVr(vr.join('.'));
    } catch (err) {
        handleErrors(err);
    }
};

export const updateVrByPrompt = async () => {
    try {
        const chooser = await inquirer.prompt([
            {
                type: 'list',
                name: 'version',
                choices: [
                    { name: 'Patch  ( ? . ? . * )', value: 2 },
                    { name: 'Minor  ( ? . * . 0 )', value: 1 },
                    { name: 'Major  ( * . 0 . 0 )', value: 0 },
                ],
            },
        ]);
        updateVrByPlace(chooser.version);
    } catch (err) {
        handleErrors(err);
    }
};

export const updateVrByWrite = async () => {
    try {
        const input = await inquirer.prompt([
            {
                type: 'input',
                name: 'Costume version',
            },
        ]);
        const value = Object.values(input)[0].toString();
        if (checkValidity(value)) {
            await changeVr(value);
        }
    } catch (err) {
        handleErrors(err);
    }
};

export const checkValidity = (value: string): boolean => {
    const splittedValue = value.split(/[,.-]/);
    const exams = [
        {
            description: 'be separated into three parts using `.`',
            method: () => splittedValue.length === 3,
        },
        {
            description: 'contain only numbers in each part',
            method: () => !splittedValue.map(part => parseInt(part)).includes(NaN),
        },
    ];

    for (const [i, exam] of exams.entries()) {
        if (!exam.method()) {
            problems.collect(`Your costume value should ${exam.description}`);
            problems.show();
            return false;
        }
    }

    return true;
};

const handleErrors = (err: any) => {
    problems.collect(err);
    problems.show();
};
