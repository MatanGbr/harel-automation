import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { upperCasedSentences } from '../../../imp/src/methods/text.method.js';
import { Spinner } from '../types/spinner.type.js';

const promptMsgWithSign = (sign: string, txt: string): void => {
    const msg = txt.trim().split(`\n`);
    console.log(
        `\n${sign}    ${upperCasedSentences(msg[0])
        + (msg[1] ? `\n\n` + upperCasedSentences(msg.slice(1).join(`\n`)) : ``)}\n`
    );
};

export const itemLog = (txt: string): void => console.log(`${color(`+`)} ${txt}`);
export const color = (txt: string): string => chalk.greenBright(txt);
export const underline = (txt: string): string => chalk.underline(txt);
export const italic = (txt: string): string => chalk.italic(txt);

export const er = (txt?: string): void => promptMsgWithSign(`⚠️`, txt ? txt.toString() : ``);
export const em = (emoji: string, txt: string): void => promptMsgWithSign(emoji, txt);

export const spinnerItem = (txt: string): Ora => {
    const oraSpinner = ora({
        text: txt, spinner: {
            frames: [`.  `, `.. `, `...`]
        }
    });
    oraSpinner.start();
    return oraSpinner;
};

export const spinnerPlus = (spinner: Ora): void => spinner.stopAndPersist({ symbol: chalk.green(` + `) });
export const spinnerQuestion = (spinner: Ora): void => spinner.stopAndPersist({ symbol: chalk.red(` ? `) });

export const heading = (txt: string): void => console.log(
    italic(`\n${upperCasedSentences(txt)}\n`)
);

export const spinner: Spinner = {
    widget: ora(),
    create: (txt: string) => {
        console.log();
        spinner.widget.start(` ${upperCasedSentences(txt)}\n`);
    },
    stop: (success: boolean = true) => success ? spinner.widget.succeed() : spinner.widget.fail()
};
