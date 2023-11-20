import chalk from 'chalk';
import { resolve } from 'path';

const convertibleTypes = ['json', 'svg'];

const onlyTree = {
  "styles": ['css', 'scss', 'sass'],
  "assets/fonts": 'ttf',
  "assets/animations": 'json',
  "assets/imgs": ['gif', 'png', 'jpg', 'jpeg']
};

const specialNames = {
  "lists": 'list',
  "globals": 'global',
  "types": 'type'
};

export const fileTreeErrs = [];

const checkLowerCase = (item) => {
  return item === item.toLowerCase();
};

const checkLocation = (itemType, currentLocation) => {
  return Object.keys(onlyTree).includes(currentLocation) && !onlyTree[currentLocation].includes(itemType);
};

const checkConvertibleType = (itemType, dir) => {
  return convertibleTypes.includes(itemType) && !dir.includes('assets');
};

const checkSpecialNames = (item, dir) => {
  const currentLocation = dir.split('/').pop();
  return Object.keys(specialNames).includes(currentLocation) && item.split('-')[0] !== specialNames[currentLocation];
};

const checkFileTypePlacement = (itemType, dir) => {
  return !['js', 'jsx', 'ts', 'tsx', 'json', 'css', 'scss', 'sass'].includes(itemType) && !dir.split('/src').pop().includes('assets');
};

export const checkFile = (item, dir) => {
  const itemType = item.split('.').pop();
  const currentLocation = dir.split('/src/').pop();
  const desiredLocation = Object.keys(onlyTree).find(key => onlyTree[key] === itemType);
  const coloredErr = `\n   ${chalk.underline.redBright('error!')}  `;
  const itemPath = `${resolve(dir)}\\${item}`.replaceAll('\\', '/');
  const tests = [
    {
      method: !checkLowerCase(item),
      message: `${itemPath} ${coloredErr} All files should be lower-cased (words separated by \`-\`)`,
      order: 2
    },
    {
      method: checkLocation(itemType, currentLocation),
      message: `${itemPath} ${coloredErr} This file type should only be placed inside ./${desiredLocation}`,
      order: 4
    },
    {
      method: checkConvertibleType(itemType, dir),
      message: `${itemPath} ${coloredErr} Please convert into a JavaScript file or place it under /assets`,
      order: 1
    },
    {
      method: checkSpecialNames(item, dir),
      message: `${itemPath} ${coloredErr} Files under ./${dir.split('/').pop()} should start with \`${specialNames[dir.split('/').pop()]}-...\` (config files would start with an underscore (\`_\`))`,
      order: 5
    },
    {
      method: checkFileTypePlacement(itemType, dir),
      message: `${itemPath}  ${coloredErr} This file type should only be placed inside /assets`,
      order: 3
    }
  ];

  tests.forEach(t => {
    if (t.method) {
      fileTreeErrs.push({
        message: t.message,
        order: t.order
      });
    }
  });
};
