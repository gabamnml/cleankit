#!/usr/bin/env node

import shell from 'shelljs';
import inquirer from 'inquirer';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const info = require('./package.json');
import ora from 'ora';
import chalk from 'chalk';
import { prompts } from './prompt.js';

const filesSpin = ora(`Getting files please wait... ${chalk.dim('(This may take longer than usual depending on the number of files)')}`);
const deleteSpin = ora('Deleting files...');

console.log(`======|| ${chalk.redBright.underline('Cleankit')} v${chalk.dim.italic(info.version)} ||======\n`);
console.log(`${chalk.dim.italic("This program is designed and intended to remove completely safe files,")}`); 
console.log(`${chalk.dim.italic("however, check carefully if you need them.")}\n`);
filesSpin.start();
let search = shell.find('.');
filesSpin.text = `Files loaded`;
filesSpin.succeed();
  
let packages = search.filter(function(file) { return file.match(/node_modules$/); });
let osFiles = search.filter(function(file) 
  { return file.match(/(.DS_Store|.Spotlight-V100|.Trashes|desktop.ini|Thumbs.db|ehthumbs.db)/); });
let gitFiles = search.filter(function(file) { return file.match(/(.*\.orig)/); });  

let pkgLength = packages.length;
let osLength = osFiles.length;
let gitLength = gitFiles.length;

console.log('• Found Packages folders: ', pkgLength);
console.log('• Found OS files: ', osLength);
console.log('• Found GIT files: ', gitLength);

let abstractPrompts = prompts;

if (!pkgLength) { abstractPrompts = removePrompt(abstractPrompts, 'packages'); }
if (!osLength) { abstractPrompts = removePrompt(abstractPrompts, 'osFiles'); }
if (!gitLength) { abstractPrompts = removePrompt(abstractPrompts, 'gitFiles'); }
  
let clean = [];

inquirer
  .prompt(abstractPrompts)
  .then((answers) => {
    if (answers.packages === 'YES') { clean.push(packages); }
    if (answers.osFiles === 'YES') { clean.push(osFiles); }
    if (answers.gitFiles === 'YES') { clean.push(gitFiles); }

    if (!clean.length) { return console.log(`${chalk.red('No files have been deleted')} 😉`)}
    
    deleteSpin.start();
    
    let cleanFlat = clean.flat(2);

    shell.rm('-rf', cleanFlat);
    
    deleteSpin.text = "Selected files deleted";
    deleteSpin.succeed();

  })
  .catch((error) => {
    if (error.isTtyError) {

      console.log("Prompt couldn't be rendered in the current environment");

    } else {

      console.log('Something else went wrong');

    }
  });
  

function removePrompt(array, name) {
  return array.filter(function(obj) { return obj.name !== name; });
}
