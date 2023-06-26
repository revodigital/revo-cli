"use strict";
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
exports.selectFolder = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("../../utils");
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
        console.log((0, utils_1.errorText)('Errore durante la selezione della cartella:\n' + error));
        process.exit(1);
    }
});
exports.selectFolder = selectFolder;
