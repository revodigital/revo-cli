import inquirer              from 'inquirer';
import { flutterMethods }    from './flutter/flutterModel';
import { prepareFlutterApp } from './flutter/flutterActions';
import { errorText }         from '../utils';

export const createLog = ({log}) => {
  console.log(log)
}

export const createError = ({error}) => {
  console.error(errorText(error))
}

export const createFlutterApp = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'method',
        message: 'Scegliere l\'opzione',
        choices: flutterMethods.map((method) => method),
      },
    ])
    .then((answers : any) => {
      prepareFlutterApp(answers)
    });
}