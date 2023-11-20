import { PkgProps } from '../types/pkg.type.js';
import { er } from './msg.js';
import { usrDir } from './usr.method.js';
import { copyFile, readFile, stat, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const RootUtilName = 'cli';

const rootUtilPath = fileURLToPath(import.meta.url);
const publicDir = resolve(`${rootUtilPath.split(`\\${RootUtilName}`)[rootUtilPath.split(`\\${RootUtilName}`).length - 2]}\\${RootUtilName}\\public`);

export const changeJson = async (path, props) => {
    try {
        const data = await readFile(path, 'utf-8');
        await writeFile(
            resolve(path),
            JSON.stringify(
                {
                    ...JSON.parse(data),
                    ...props
                },
                null, `\t`
            )
        );
    } catch (err) {
        er(`Can't write: ${path}`);
    }
};

export const exists = async (path) => {
    try {
        await stat(path);
        return true;
    } catch (err) {
        if (err.errno === -4058) {
            return false;
        }
        return err;
    }
};

export const checkPkg = async (path) => {
    try {
        const data = await readFile(resolve(`${path}/package.json`), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        if (error.errno === -4058) {
            throw `Couldn't find package.json based on this path. Check the destination and try again.`;
        } else {
            throw error;
        }
    }
};

export const placeStartUp = async (items) => {
    const problems = [];
    const flattedItems = [items].flat();
    await Promise.all(
        flattedItems.map(async (item) => {
            try {
                await copyFile(
                    resolve(`${publicDir}/start/${item}`),
                    resolve(`${usrDir}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/${item}`)
                );
            } catch (err) {
                problems.push(err);
            }
        })
    );

    if (problems.length !== 0) {
        problems.forEach((problem) => er(problem));
    }
};
import { PkgProps } from '../types/pkg.type.js';
import { er } from './msg.js';
import { usrDir } from './usr.method.js';
import { copyFile, readFile, stat, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const RootUtilName = 'cli';

const rootUtilPath = fileURLToPath(import.meta.url);
const publicDir = resolve(`${rootUtilPath.split(`\\${RootUtilName}`)[rootUtilPath.split(`\\${RootUtilName}`).length - 2]}\\${RootUtilName}\\public`);

export const changeJson = async (path, props) => {
    try {
        const data = await readFile(path, 'utf-8');
        await writeFile(
            resolve(path),
            JSON.stringify(
                {
                    ...JSON.parse(data),
                    ...props
                },
                null, `\t`
            )
        );
    } catch (err) {
        er(`Can't write: ${path}`);
    }
};

export const exists = async (path) => {
    try {
        await stat(path);
        return true;
    } catch (err) {
        if (err.errno === -4058) {
            return false;
        }
        return err;
    }
};

export const checkPkg = async (path) => {
    try {
        const data = await readFile(resolve(`${path}/package.json`), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        if (error.errno === -4058) {
            throw `Couldn't find package.json based on this path. Check the destination and try again.`;
        } else {
            throw error;
        }
    }
};

export const placeStartUp = async (items) => {
    const problems = [];
    const flattedItems = [items].flat();
    await Promise.all(
        flattedItems.map(async (item) => {
            try {
                await copyFile(
                    resolve(`${publicDir}/start/${item}`),
                    resolve(`${usrDir}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/${item}`)
                );
            } catch (err) {
                problems.push(err);
            }
        })
    );

    if (problems.length !== 0) {
        problems.forEach((problem) => er(problem));
    }
};
