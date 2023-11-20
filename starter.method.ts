import { Starter } from '../../types/starter.type.js';
import { exists, publicDir } from './files.method.js';
import { color, er, heading, itemLog, underline } from './msg.js';
import { problems } from './problems.method.js';
import { targetPath } from './usr.method.js';
import { copyFile, mkdir, readdir } from 'fs/promises';
import { resolve } from 'path';

const paths = targetPath.split('\\');
const dirName = paths[paths.length - 1];

let overwrite = false;
let tell = true;
let copied = false;

const handleFiles = async (src, target) => {
    try {
        const items = await readdir(src, { withFileTypes: true });

        await Promise.all(
            items.map(async (item) => {
                if (item.isDirectory()) {
                    if (!(await exists(`${target}/${item.name}`))) {
                        await mkdir(`${target}/${item.name}`);
                    }
                    await handleFiles(`${src}/${item.name}`, `${target}/${item.name}`);
                } else {
                    if (shouldCopyFile(`${target}/${item.name}`)) {
                        try {
                            if (tell) {
                                heading(`Adding files to ${dirName}:`);
                                tell = false;
                            }

                            await copyFile(resolve(`${src}/${item.name}`), `${target}/${item.name}`);
                            itemLog(`${target.split(dirName + '/').slice(1).toString()}/${item.name}`);
                            copied = true;
                        } catch (err) {
                            problems.collect(err);
                        }
                    }
                }
            })
        );
    } catch (err) {
        problems.collect(err);
    }
};

const shouldCopyFile = async (filePath) => {
    return overwrite || (!overwrite && !(await exists(filePath)));
};

export const copyStarter = async (type, force = false) => {
    overwrite = force;
    await handleFiles(`${publicDir}/starter/${type}`, `${targetPath}/src`);
    if (copied) {
        problems.check() ? console.log() : problems.show();
    } else {
        er(`all files already exist. \nrun this command with '${color(underline(`overwrite`))}' to force all changes.`);
    }
};
