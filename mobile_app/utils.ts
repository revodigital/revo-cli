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
import * as path                 from 'path';
import { FileRepository }        from './FileRepository';
import AdmZip                    from 'adm-zip';

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

export const downloadRepoZip = async (type: AppTypesEnum, branch: FlutterGHBranchesEnum, pathD: string, projectName: string) => {
  const url = `https://github.com/revodigital/${type}/archive/${branch}.zip`;
  const zipFileName = projectName + branch + ".zip"
  const zipFilePath = pathD + '/' + zipFileName;
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

export const extractAndRenameFolder = (zipFilePath: string, extractedFolderPath: string, newFolderName: string) => {
  const zip = new AdmZip(zipFilePath);
  zip.extractAllTo(extractedFolderPath, /*overwrite*/ true);

  const extractedFolderName = zip.getEntries()[0]?.entryName.split('/')[0];
  const extractedFolder = path.join(extractedFolderPath, extractedFolderName);

  const renamedFolderPath = path.join(extractedFolderPath, newFolderName);
  fs.mkdirSync(renamedFolderPath);

  const files = fs.readdirSync(extractedFolder);
  files.forEach((file) => {
    const sourcePath = path.join(extractedFolder, file);
    const targetPath = path.join(renamedFolderPath, file);
    fs.renameSync(sourcePath, targetPath);
  });

  fs.rmdirSync(extractedFolder);
  deleteZip(zipFilePath);
}

const deleteZip = (zipFilePath: string) => {
  fs.unlinkSync(zipFilePath);
}

export const changeAppName = async (fileRepository: FileRepository, appName: string, appPath: string) => {
  await fileRepository.changeIosAppName(appName, appPath);
  await fileRepository.changeAndroidAppName(appName, appPath);
}

export const changeBundleId = async (fileRepository: FileRepository, bundleId: string, appPath: string) => {
  await fileRepository.changeIosBundleId({bundleId: bundleId, appPath: appPath});
  await fileRepository.changeAndroidBundleId({bundleId: bundleId, appPath: appPath});
}

export const updateMainActivityAndDirectory = async (fileRepository: FileRepository, bundleId: string) => {
  await fileRepository.updateMainActivity()
}