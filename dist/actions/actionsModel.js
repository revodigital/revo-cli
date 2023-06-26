"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAction = exports.prepareOptions = exports.ActionsEnum = void 0;
const actions_1 = require("./actions");
const actionOptions_1 = require("./actionOptions");
var ActionsEnum;
(function (ActionsEnum) {
    ActionsEnum["CREATE_LOG"] = "create-log";
    ActionsEnum["CREATE_ERROR"] = "create-error";
    ActionsEnum["CREATE_FLUTTER_APP"] = "create-flutter-app";
})(ActionsEnum || (exports.ActionsEnum = ActionsEnum = {}));
const prepareOptions = (action) => {
    switch (action) {
        case ActionsEnum.CREATE_LOG: {
            return actionOptions_1.createLogOptions;
        }
        case ActionsEnum.CREATE_ERROR: {
            return actionOptions_1.createErrorOptions;
        }
        case ActionsEnum.CREATE_FLUTTER_APP: {
            return actionOptions_1.createFlutterOptions;
        }
        default: {
            break;
        }
    }
};
exports.prepareOptions = prepareOptions;
const runAction = (action, args) => {
    switch (action) {
        case ActionsEnum.CREATE_LOG: {
            (0, actions_1.createLog)(args);
            break;
        }
        case ActionsEnum.CREATE_ERROR: {
            (0, actions_1.createError)(args);
            break;
        }
        case ActionsEnum.CREATE_FLUTTER_APP: {
            (0, actions_1.createFlutterApp)();
            break;
        }
        default: {
            break;
        }
    }
};
exports.runAction = runAction;
