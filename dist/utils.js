"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadRepoZip = exports.getInput = exports.selectFolder = exports.createCommand = exports.successfulText = exports.errorText = exports.warningText = void 0;
const actionsModel_1 = require("./actions/actionsModel");
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const inquirer_1 = __importDefault(require("inquirer"));
const axios_1 = __importDefault(require("axios"));
exports.warningText = chalk_1.default.yellow;
exports.errorText = chalk_1.default.red;
exports.successfulText = chalk_1.default.green;
const createCommand = (program, action) => {
    const myProgram = program.command(action);
    createOptions(myProgram, action);
    myProgram.action((args) => {
        (0, actionsModel_1.runAction)(action, args);
    });
};
exports.createCommand = createCommand;
const createOptions = (program, action) => {
    const options = (0, actionsModel_1.prepareOptions)(action);
    for (let i = 0; i < options.length; i++) {
        program.option(options[i].flags, options[i].description);
    }
};
const selectFolder = () => __awaiter(void 0, void 0, void 0, function* () {
    inquirer_1.default.registerPrompt('directory', require('inquirer-directory'));
    const folderPrompt = [{
            type: 'directory',
            name: 'selectedFolder',
            message: 'Seleziona la cartella dove verrà creato il progetto:',
            basePath: "./"
        }];
    try {
        const { selectedFolder } = yield inquirer_1.default.prompt(folderPrompt);
        return selectedFolder;
    }
    catch (error) {
        console.log((0, exports.errorText)('Errore durante la selezione della cartella:\n' + error));
        process.exit(1);
    }
});
exports.selectFolder = selectFolder;
const getInput = (description) => __awaiter(void 0, void 0, void 0, function* () {
    inquirer_1.default.registerPrompt('directory', require('inquirer-directory'));
    const folderPrompt = [{
            type: 'input',
            name: 'input',
            message: description
        }];
    try {
        const { input } = yield inquirer_1.default.prompt(folderPrompt);
        return input;
    }
    catch (error) {
        console.log((0, exports.errorText)('Errore durante la ricezione di input:\n' + error));
        process.exit(1);
    }
});
exports.getInput = getInput;
const downloadRepoZip = (type, branch, path, projectName) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://github.com/revodigital/${type}/archive/${branch}.zip`;
    const zipFileName = projectName + ".zip";
    const zipFilePath = path + '/' + zipFileName;
    const file = fs.createWriteStream(zipFilePath);
    const { data } = yield (0, axios_1.default)({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    data.pipe(file);
    return new Promise((resolve, reject) => {
        file.on('finish', () => resolve(zipFilePath));
        file.on('error', reject);
    });
});
exports.downloadRepoZip = downloadRepoZip;
