import { createError, createLog }               from './actions';
import { createErrorOptions, createLogOptions } from './actionOptions';

export enum ActionsEnum {
  CREATE_LOG = "create-log",
  CREATE_ERROR = "create-error"
}


export const prepareOptions = (action: ActionsEnum) => {
  switch (action) {
    case ActionsEnum.CREATE_LOG: {
      return createLogOptions;
    }

    case ActionsEnum.CREATE_ERROR: {
      return createErrorOptions;
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

    default: {
      break;
    }
  }
}