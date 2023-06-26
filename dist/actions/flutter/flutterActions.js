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
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareFlutterApp = void 0;
const flutterModel_1 = require("./flutterModel");
const utils_1 = require("../../utils");
const path = __importStar(require("path"));
const types_1 = require("../../types");
const prepareFlutterApp = ({ method }) => {
    switch (method) {
        case flutterModel_1.FlutterEnum.DEAFULT: {
            defaultFlutterApp();
            break;
        }
        default: {
            console.log((0, utils_1.warningText)("Opzione non ancora implementata"));
            break;
        }
    }
};
exports.prepareFlutterApp = prepareFlutterApp;
const defaultFlutterApp = () => {
    (0, utils_1.selectFolder)().then((value) => {
        const selectedFolderAbsolutePath = path.resolve(value);
        (0, utils_1.getInput)("Inserire il nome del progetto:").then((name) => {
            (0, utils_1.getInput)("Inserire il bundleIdentifier(package):").then((identifier) => {
                (0, utils_1.downloadRepoZip)(types_1.AppTypesEnum.FLUTTER, flutterModel_1.FlutterGHBranchesEnum.DEAFULT, selectedFolderAbsolutePath, name).then((zipFilePath) => {
                    console.log((0, utils_1.successfulText)('Download completato. File .zip salvato in:+\n' + zipFilePath));
                }).catch((error) => {
                    console.log((0, utils_1.errorText)('Errore durante il download zip:\n' + error));
                    process.exit(1);
                });
            }).catch((err) => {
                console.log((0, utils_1.errorText)('Errore durante la ricezione di input:\n' + err));
                process.exit(1);
            });
        }).catch((erro) => {
            console.log((0, utils_1.errorText)('Errore durante la ricezione di input:\n' + erro));
            process.exit(1);
        });
    }).catch((error) => {
        console.log((0, utils_1.errorText)('Errore durante la selezione della cartella:\n' + error));
        process.exit(1);
    });
};
