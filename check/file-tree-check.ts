import { middleError } from '../../bins/check.js';
import { spinner } from '../msg.js';
import { checkFile, fileTreeErrs } from './check-file.js';
import { readdir } from 'fs/promises';
import ora from 'ora';

export const fileTreeCheck = async () => {
   const loading = ora(`Analyzing file tree`);

   const scan = async (dir = `./src`): Promise<{ dir: string; name: string }[]> => {
      const files = await Promise.all((await readdir(dir, { withFileTypes: true }))
         .map(async dirent => {
            return dirent.isDirectory()
               ? scan(`${dir}/${dirent.name}`)
               : { dir: dir, name: dirent.name };
         })
      );
      return Array.prototype.concat(...files);
   };

   loading.start();

   try {
      const data = await scan();
      for (const file of data) {
         checkFile(file.name, file.dir);
      }

      if (fileTreeErrs.length === 0) {
         loading.succeed();
      } else {
         loading.fail();
         fileTreeErrs
            .sort((a, b) => a.order - b.order)
            .forEach((err, i) =>
               console.log(` ${err.message.replace(/\/\/src/g, ``)} ${i === (fileTreeErrs.length - 1) ? `\n` : ``}`)
            );
         throw middleError;
      }
   } catch (err) {
      throw err;
   } finally {
      loading.stop();
   }
};
