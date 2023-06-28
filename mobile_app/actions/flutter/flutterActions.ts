import { FlutterEnum, FlutterGHBranchesEnum } from './flutterModel';
import {
  changeAppName, changeBundleId,
  downloadRepoZip,
  errorText, extractAndRenameFolder,
  getInput,
  selectFolder,
  successfulText, updateMainActivityAndDirectory,
  warningText
} from '../../utils';
import * as path          from 'path';
import {
  AppTypesEnum
}                         from '../../types';
import { FileRepository } from '../../FileRepository';

export const prepareFlutterApp = ({method}) => {
  switch (method) {
    case FlutterEnum.DEAFULT: {
      defaultFlutterApp()
      break;
    }

    default: {
      console.log(warningText("Opzione non ancora implementata"));
      break;
    }
  }
}

const defaultFlutterApp = async () => {
  try {
    const value = await selectFolder();
    const selectedFolderAbsolutePath = path.resolve(value);

    const name = await getInput("Inserire il nome del progetto:");
    const identifier = await getInput("Inserire il bundleIdentifier(com.app.example):");

    const zipFilePath = await downloadRepoZip(AppTypesEnum.FLUTTER, FlutterGHBranchesEnum.DEAFULT, selectedFolderAbsolutePath, name);
    extractAndRenameFolder(zipFilePath, selectedFolderAbsolutePath, name)

    let fileRepository : FileRepository = new FileRepository();
    await changeAppName(fileRepository, name, path.join(selectedFolderAbsolutePath, name))
    await changeBundleId(fileRepository, identifier, path.join(selectedFolderAbsolutePath, name))
    await updateMainActivityAndDirectory(fileRepository, identifier)
  } catch (e) {
    console.log(successfulText(e));
  }
}