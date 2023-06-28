import { createError, createFlutterApp, createLog } from './actions';
import {
  createErrorOptions,
  createFlutterOptions,
  createLogOptions
}                                                   from './actionOptions';

export enum ActionsEnum {
  CREATE_LOG = "create-log",
  CREATE_ERROR = "create-error",
  CREATE_FLUTTER_APP = "create-flutter-app"
}


export const prepareOptions = (action: ActionsEnum) => {
  switch (action) {
    case ActionsEnum.CREATE_LOG: {
      return createLogOptions;
    }

    case ActionsEnum.CREATE_ERROR: {
      return createErrorOptions;
    }

    case ActionsEnum.CREATE_FLUTTER_APP: {
      return createFlutterOptions;
    }

    default: {
      break;
    }
  }
}

export const runAction = (action: ActionsEnum, args: any) => {
  switch (action) {
    case ActionsEnum.CREATE_LOG: {
      createLog(args);
      break;
    }

    case ActionsEnum.CREATE_ERROR: {
      createError(args);
      break;
    }

    case ActionsEnum.CREATE_FLUTTER_APP: {
      createFlutterApp();
      break;
    }

    default: {
      break;
    }
  }
}