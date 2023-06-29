import { FlutterEnum, FlutterGHBranchesEnum } from './flutterModel';
import {
  addAndUpdateIgnoredFiles,
  blackText,
  changeAppName, changeBundleId, checkFlutterAndAndroidSDK,
  downloadRepoZip,
  errorText, extractAndRenameFolder,
  getInput,
  selectFolder, successfulBg,
  updateMainActivityAndDirectory,
  warningText, whiteText
} from '../../utils';
import * as path          from 'path';
import {
  AppTypesEnum
}                         from '../../types';
import { FileRepository } from '../../FileRepository';

export const prepareFlutterApp = ({method}) => {
  switch (method) {
    case FlutterEnum.DEAFULT: {
      if (checkFlutterAndAndroidSDK()){
        defaultFlutterApp()
      }
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
    console.log(blackText("----------"));
    await changeBundleId(fileRepository, identifier, path.join(selectedFolderAbsolutePath, name))
    console.log(blackText("----------"));
    await updateMainActivityAndDirectory(fileRepository, path.join(selectedFolderAbsolutePath, name), identifier)
    console.log(blackText("----------"));
    await addAndUpdateIgnoredFiles(fileRepository, path.join(selectedFolderAbsolutePath, name), name)
    console.log(successfulBg(whiteText("Progetto configurato!\n")));
    console.log(blackText("All\'apertura del progetto dovrai eseguire le seguenti azioni:\n1. flutter pub get"));
  } catch (e) {
    console.log(errorText(e));
  }
}