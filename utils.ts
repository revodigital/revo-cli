import { Command }               from 'commander';
import {
  ActionsEnum,
  runAction,
  prepareOptions
}                                from './actions/actionsModel';
import chalk                     from 'chalk';
import { FlutterGHBranchesEnum } from './actions/flutter/flutterModel';
import { AppTypesEnum }          from './types';
import * as fs                   from 'fs';
import inquirer                  from 'inquirer';
import axios                     from 'axios';

export const warningText = chalk.yellow
export const errorText = chalk.red
export const successfulText = chalk.green

export const createCommand = (program: Command, action: ActionsEnum) => {
  const myProgram = program.command(action)
  createOptions(myProgram, action)
  myProgram.action((args) => {
    runAction(action, args)
  })
}

const createOptions = (program: Command, action: ActionsEnum) => {
  const options = prepareOptions(action)

  for (let i = 0; i < options.length; i++) {
    program.option(options[i].flags, options[i].description)
  }
}

export const selectFolder = async () => {
  inquirer.registerPrompt('directory', require('inquirer-directory'));
  const folderPrompt = [{
    type: 'directory',
    name: 'selectedFolder',
    message: 'Seleziona la cartella dove verrà creato il progetto:',
    basePath: "./"
  }];

  try {
    const { selectedFolder } = await inquirer.prompt(folderPrompt);
    return selectedFolder;
  } catch (error) {
    console.log(errorText('Errore durante la selezione della cartella:\n' + error));
    process.exit(1);
  }
}

export const getInput = async (description: string) => {
  inquirer.registerPrompt('directory', require('inquirer-directory'));
  const folderPrompt = [{
    type: 'input',
    name: 'input',
    message: description
  }];

  try {
    const { input } = await inquirer.prompt(folderPrompt);
    return input;
  } catch (error) {
    console.log(errorText('Errore durante la ricezione di input:\n' + error));
    process.exit(1);
  }
}

export const downloadRepoZip = async (type: AppTypesEnum, branch: FlutterGHBranchesEnum, path: string, projectName: string) => {
  const url = `https://github.com/revodigital/${type}/archive/${branch}.zip`;
  const zipFileName = projectName + ".zip"
  const zipFilePath = path + '/' + zipFileName;
  const file = fs.createWriteStream(zipFilePath);

  const { data } = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  })

  data.pipe(file);

  return new Promise<string>((resolve, reject) => {
    file.on('finish', () => resolve(zipFilePath));
    file.on('error', reject);
  });
}