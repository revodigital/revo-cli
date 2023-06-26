import { FlutterEnum, FlutterGHBranchesEnum } from './flutterModel';
import {
  downloadRepoZip,
  errorText, getInput, selectFolder,
  successfulText,
  warningText
}                                             from '../../utils';
import * as path       from 'path';
import {
  AppTypesEnum
}                      from '../../types';

export const prepareFlutterApp = ({method}) => {
  switch (method) {
    case FlutterEnum.DEAFULT: {
      defaultFlutterApp();
      break;
    }

    default: {
      console.log(warningText("Opzione non ancora implementata"));
      break;
    }
  }
}

const defaultFlutterApp = () => {
  selectFolder().then((value) => {
    const selectedFolderAbsolutePath = path.resolve(value);
    getInput("Inserire il nome del progetto:").then((name) => {
      getInput("Inserire il bundleIdentifier(package):").then((identifier) => {
        downloadRepoZip(AppTypesEnum.FLUTTER, FlutterGHBranchesEnum.DEAFULT, selectedFolderAbsolutePath, name).then((zipFilePath) => {
          console.log(successfulText('Download completato. File .zip salvato in:+\n' + zipFilePath));
        }).catch((error) => {
          console.log(errorText('Errore durante il download zip:\n' + error));
          process.exit(1);
        })
      }).catch((err) => {
        console.log(errorText('Errore durante la ricezione di input:\n' + err));
        process.exit(1);
      })
    }).catch((erro) => {
      console.log(errorText('Errore durante la ricezione di input:\n' + erro));
      process.exit(1);
    })
  }).catch((error) => {
    console.log(errorText('Errore durante la selezione della cartella:\n' + error));
    process.exit(1);
  })
}