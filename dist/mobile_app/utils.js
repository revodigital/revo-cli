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
exports.checkFlutterAndAndroidSDK = exports.addAndUpdateIgnoredFiles = exports.updateMainActivityAndDirectory = exports.changeBundleId = exports.changeAppName = exports.extractAndRenameFolder = exports.downloadRepoZip = exports.getInput = exports.selectFolder = exports.createCommand = exports.whiteText = exports.errorBg = exports.successfulBg = exports.blackText = exports.successfulText = exports.errorText = exports.warningText = void 0;
const actionsModel_1 = require("./actions/actionsModel");
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const inquirer_1 = __importDefault(require("inquirer"));
const axios_1 = __importDefault(require("axios"));
const path = __importStar(require("path"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const child_process_1 = require("child_process");
exports.warningText = chalk_1.default.yellow;
exports.errorText = chalk_1.default.red;
exports.successfulText = chalk_1.default.green;
exports.blackText = chalk_1.default.black;
exports.successfulBg = chalk_1.default.bgGreen;
exports.errorBg = chalk_1.default.bgRed;
exports.whiteText = chalk_1.default.white;
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
const downloadRepoZip = (type, branch, pathD, projectName) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://github.com/revodigital/${type}/archive/${branch}.zip`;
    const zipFileName = projectName + branch + ".zip";
    const zipFilePath = pathD + '/' + zipFileName;
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
const extractAndRenameFolder = (zipFilePath, extractedFolderPath, newFolderName) => {
    var _a;
    const zip = new adm_zip_1.default(zipFilePath);
    zip.extractAllTo(extractedFolderPath, true);
    const extractedFolderName = (_a = zip.getEntries()[0]) === null || _a === void 0 ? void 0 : _a.entryName.split('/')[0];
    const extractedFolder = path.join(extractedFolderPath, extractedFolderName);
    const renamedFolderPath = path.join(extractedFolderPath, newFolderName);
    fs.mkdirSync(renamedFolderPath);
    const files = fs.readdirSync(extractedFolder);
    files.forEach((file) => {
        const sourcePath = path.join(extractedFolder, file);
        const targetPath = path.join(renamedFolderPath, file);
        fs.renameSync(sourcePath, targetPath);
    });
    fs.rmdirSync(extractedFolder);
    deleteZip(zipFilePath);
};
exports.extractAndRenameFolder = extractAndRenameFolder;
const deleteZip = (zipFilePath) => {
    fs.unlinkSync(zipFilePath);
};
const changeAppName = (fileRepository, appName, appPath) => __awaiter(void 0, void 0, void 0, function* () {
    yield fileRepository.changeIosAppName(appName, appPath);
    yield fileRepository.changeAndroidAppName(appName, appPath);
});
exports.changeAppName = changeAppName;
const changeBundleId = (fileRepository, bundleId, appPath) => __awaiter(void 0, void 0, void 0, function* () {
    yield fileRepository.changeIosBundleId({ bundleId: bundleId, appPath: appPath });
    yield fileRepository.changeAndroidBundleId({ bundleId: bundleId, appPath: appPath });
});
exports.changeBundleId = changeBundleId;
const updateMainActivityAndDirectory = (fileRepository, appPath, bundleId) => __awaiter(void 0, void 0, void 0, function* () {
    yield fileRepository.updateMainActivity(appPath, bundleId);
});
exports.updateMainActivityAndDirectory = updateMainActivityAndDirectory;
const addAndUpdateIgnoredFiles = (fileRepository, appPath, appName, identifier) => __awaiter(void 0, void 0, void 0, function* () {
    const androidIgnoredFilePath = 'android/';
    yield addIgnoredFiles(fileRepository, appPath);
    yield updateIgnoredFiles(fileRepository, appPath, identifier);
    fs.renameSync(path.join(appPath, androidIgnoredFilePath, "flutter_boilerplate_android.iml"), path.join(appPath, androidIgnoredFilePath, appName + "_android.iml"));
    fs.renameSync(path.join(appPath, "flutter_revo_boilerplate.iml"), path.join(appPath, appName + ".iml"));
});
exports.addAndUpdateIgnoredFiles = addAndUpdateIgnoredFiles;
const addIgnoredFiles = (fileRepository, appPath) => __awaiter(void 0, void 0, void 0, function* () {
    const androidIgnoredFilePath = 'android/';
    const iOSIgnoredFilePath1 = 'ios/Flutter/';
    const iOSIgnoredFilePath2 = 'ios/Runner/';
    yield fileRepository.addIgnoredFiles(path.join(appPath, androidIgnoredFilePath), "flutter_boilerplate_android.iml", true);
    yield fileRepository.addIgnoredFiles(path.join(appPath, androidIgnoredFilePath), "gradlew", true);
    yield fileRepository.addIgnoredFiles(path.join(appPath, androidIgnoredFilePath), "gradlew.bat", true);
    yield fileRepository.addIgnoredFiles(path.join(appPath, androidIgnoredFilePath), "local.properties", true);
    yield fileRepository.addIgnoredFiles(path.join(appPath, iOSIgnoredFilePath1), "flutter_export_environment.sh", false);
    yield fileRepository.addIgnoredFiles(path.join(appPath, iOSIgnoredFilePath1), "Generated.xcconfig", false);
    yield fileRepository.addIgnoredFiles(path.join(appPath, iOSIgnoredFilePath2), "GeneratedPluginRegistrant.h", false);
    yield fileRepository.addIgnoredFiles(path.join(appPath, iOSIgnoredFilePath2), "GeneratedPluginRegistrant.m", false);
    yield fileRepository.addIgnoredFiles(appPath, "flutter_revo_boilerplate.iml", null);
});
const updateIgnoredFiles = (fileRepository, appPath, bundleId) => __awaiter(void 0, void 0, void 0, function* () {
    const androidIgnoredFilePath = 'android/';
    const iOSIgnoredFilePath1 = 'ios/Flutter/';
    const flutterSdk = getFlutterSdk();
    const androidSdkPath = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME || '';
    yield fileRepository.editInformationForIgnoredFiles(path.join(appPath, androidIgnoredFilePath, "local.properties"), "sdk.dir=", "sdk.dir=" + androidSdkPath);
    yield fileRepository.editInformationForIgnoredFiles(path.join(appPath, androidIgnoredFilePath, "local.properties"), "flutter.sdk=", "flutter.sdk=" + flutterSdk);
    yield fileRepository.editInformationForIgnoredFiles(path.join(appPath, iOSIgnoredFilePath1, "flutter_export_environment.sh"), "export \"FLUTTER_ROOT=\"", "export \"FLUTTER_ROOT=" + flutterSdk + "\"");
    yield fileRepository.editInformationForIgnoredFiles(path.join(appPath, iOSIgnoredFilePath1, "flutter_export_environment.sh"), "export \"FLUTTER_APPLICATION_PATH=\"", "export \"FLUTTER_APPLICATION_PATH=" + appPath + "\"");
    yield fileRepository.editInformationForIgnoredFiles(path.join(appPath, androidIgnoredFilePath + "app/src/main/", "AndroidManifest.xml"), "package=\"it.revodigital.flutterboilerplate.flutter_boilerplate\"", "package=\"" + bundleId + "\">");
    yield fileRepository.editInformationForIgnoredFiles(path.join(appPath, androidIgnoredFilePath + "app/src/debug/", "AndroidManifest.xml"), "package=\"it.revodigital.flutterboilerplate.flutter_boilerplate\"", "package=\"" + bundleId + "\">");
    yield fileRepository.editInformationForIgnoredFiles(path.join(appPath, androidIgnoredFilePath + "app/src/profile/", "AndroidManifest.xml"), "package=\"it.revodigital.flutterboilerplate.flutter_boilerplate\"", "package=\"" + bundleId + "\">");
});
const getFlutterSdk = () => {
    const flutterBinPath = (0, child_process_1.execSync)('which flutter').toString().trim();
    return path.resolve(flutterBinPath, '..', '..');
};
const checkFlutterAndAndroidSDK = () => {
    try {
        (0, child_process_1.execSync)('flutter --version');
        const androidSdkPath = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME || '';
        if (androidSdkPath === '') {
            console.log((0, exports.errorBg)("Android SDK non installata, processo annullato"));
            process.exit(3);
        }
        return true;
    }
    catch (error) {
        console.log((0, exports.errorBg)("Flutter SDK non installata, processo annullato"));
        process.exit(3);
    }
};
exports.checkFlutterAndAndroidSDK = checkFlutterAndAndroidSDK;
