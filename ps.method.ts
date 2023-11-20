import { exec } from 'child_process';
import { promisify } from 'util';
import { ampersand } from '../../../imp/src/methods/text.method.js';
import { spinner } from './msg.js';
import { problems } from './problems.method.js';

const executeCommand = async (command: string, cwd?: string): Promise<void> => {
    const promisifiedExec = promisify(exec);

    try {
        await promisifiedExec(command, { shell: 'powershell.exe', ...(cwd && { cwd }) });
    } catch (err) {
        problems.collect(err);
    }
};

const executeCommands = async (commands: { name: string; process: string }[]): Promise<void> => {
    const items = [commands].flat();

    spinner.create(`installing ${ampersand(items.map(({ name }) => name))}.\nplease handle Windows' confirmation prompts in the process`);

    await Promise.all(
        items.map(async ({ process }) => {
            await executeCommand(process);
        })
    );

    if (problems.check()) {
        spinner.stop();
    } else {
        spinner.stop(false);
        problems.show();
    }
};

const addRegistries = async (cmd: string | string[]): Promise<void> => {
    const items = [cmd].flat();

    spinner.create(`adding registries`);

    await Promise.all(
        items.map(async (item: string) => {
            await executeCommand(`reg add ${item}`);
        })
    );

    if (problems.check()) {
        spinner.stop();
    } else {
        spinner.stop(false);
        problems.show();
    }
};

export { executeCommand, executeCommands, addRegistries };
