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
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareFlutterApp = void 0;
const flutterModel_1 = require("./flutterModel");
const utils_1 = require("../../utils");
const path = __importStar(require("path"));
const types_1 = require("../../types");
const FileRepository_1 = require("../../FileRepository");
const prepareFlutterApp = ({ method }) => {
    switch (method) {
        case flutterModel_1.FlutterEnum.DEAFULT: {
            if ((0, utils_1.checkFlutterAndAndroidSDK)()) {
                defaultFlutterApp();
            }
            break;
        }
        default: {
            console.log((0, utils_1.warningText)("Opzione non ancora implementata"));
            break;
        }
    }
};
exports.prepareFlutterApp = prepareFlutterApp;
const defaultFlutterApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = yield (0, utils_1.selectFolder)();
        const selectedFolderAbsolutePath = path.resolve(value);
        const name = yield (0, utils_1.getInput)("Inserire il nome del progetto:");
        const identifier = yield (0, utils_1.getInput)("Inserire il bundleIdentifier(com.app.example):");
        const zipFilePath = yield (0, utils_1.downloadRepoZip)(types_1.AppTypesEnum.FLUTTER, flutterModel_1.FlutterGHBranchesEnum.DEAFULT, selectedFolderAbsolutePath, name);
        (0, utils_1.extractAndRenameFolder)(zipFilePath, selectedFolderAbsolutePath, name);
        let fileRepository = new FileRepository_1.FileRepository();
        yield (0, utils_1.changeAppName)(fileRepository, name, path.join(selectedFolderAbsolutePath, name));
        console.log((0, utils_1.blackText)("----------"));
        yield (0, utils_1.changeBundleId)(fileRepository, identifier, path.join(selectedFolderAbsolutePath, name));
        console.log((0, utils_1.blackText)("----------"));
        yield (0, utils_1.updateMainActivityAndDirectory)(fileRepository, path.join(selectedFolderAbsolutePath, name), identifier);
        console.log((0, utils_1.blackText)("----------"));
        yield (0, utils_1.addAndUpdateIgnoredFiles)(fileRepository, path.join(selectedFolderAbsolutePath, name), name, identifier);
        console.log((0, utils_1.successfulBg)((0, utils_1.whiteText)("Progetto configurato!\n")));
        console.log((0, utils_1.blackText)("All\'apertura del progetto dovrai eseguire le seguenti azioni:\n1. flutter pub get"));
    }
    catch (e) {
        console.log((0, utils_1.errorText)(e));
    }
});
