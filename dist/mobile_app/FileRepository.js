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
exports.FileRepository = void 0;
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
const path = __importStar(require("path"));
class FileRepository {
    constructor() {
        this.androidManifestPath = '.\\android\\app\\src\\main\\AndroidManifest.xml';
        this.iosInfoPlistPath = '.\\ios\\Runner\\Info.plist';
        this.androidAppBuildGradlePath = '.\\android\\app\\build.gradle';
        this.iosProjectPbxprojPath = '.\\ios\\Runner.xcodeproj\\project.pbxproj';
        this.launcherIconPath = '.\\assets\\images\\launcherIcon.png';
        this.pathActivity = 'android/app/src/main/kotlin';
        if (process.platform == "linux" || process.platform == "darwin") {
            this.androidManifestPath = 'android/app/src/main/AndroidManifest.xml';
            this.iosInfoPlistPath = 'ios/Runner/Info.plist';
            this.androidAppBuildGradlePath = 'android/app/build.gradle';
            this.iosProjectPbxprojPath = 'ios/Runner.xcodeproj/project.pbxproj';
            this.launcherIconPath = 'assets/images/launcherIcon.png';
        }
    }
    checkFileExists(fileContent) {
        return fileContent == null || fileContent.length == 0;
    }
    readFileAsLineByline({ filePath }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileAsString = fs_1.default.readFileSync(filePath).toString();
                return fileAsString.split('\n');
            }
            catch (e) {
                return null;
            }
        });
    }
    writeFile({ filePath, content }) {
        fs_1.default.writeFileSync(filePath, content);
    }
    changeIosBundleId({ bundleId, appPath }) {
        return __awaiter(this, void 0, void 0, function* () {
            let contentLineByLine = yield this.readFileAsLineByline({ filePath: appPath + "/" + this.iosProjectPbxprojPath });
            if (this.checkFileExists(contentLineByLine)) {
                console.log((0, utils_1.errorText)("iOS bundle ID non può essere cambiato, il file non è stato trovato in: " + appPath + "/" + this.iosProjectPbxprojPath));
                return null;
            }
            for (let i = 0; i < contentLineByLine.length; i++) {
                if (contentLineByLine[i].includes('PRODUCT_BUNDLE_IDENTIFIER')) {
                    contentLineByLine[i] = '				PRODUCT_BUNDLE_IDENTIFIER = ' + bundleId + ";";
                }
            }
            this.writeFile({ filePath: appPath + "/" + this.iosProjectPbxprojPath, content: contentLineByLine.join('\n') });
            console.log((0, utils_1.successfulText)("iOS bundle ID cambiato in: " + bundleId));
        });
    }
    changeAndroidBundleId({ bundleId, appPath }) {
        return __awaiter(this, void 0, void 0, function* () {
            let contentLineByLine = yield this.readFileAsLineByline({ filePath: appPath + "/" + this.androidAppBuildGradlePath });
            if (this.checkFileExists(contentLineByLine)) {
                console.log((0, utils_1.errorText)("Android bundle ID non può essere cambiato, il file non è stato trovato in: " + appPath + "/" + this.androidAppBuildGradlePath));
                return null;
            }
            for (let i = 0; i < contentLineByLine.length; i++) {
                if (contentLineByLine[i].includes('applicationId')) {
                    contentLineByLine[i] = '        applicationId \"' + bundleId + '\"';
                    break;
                }
            }
            this.writeFile({ filePath: appPath + "/" + this.androidAppBuildGradlePath, content: contentLineByLine.join('\n') });
            console.log((0, utils_1.successfulText)("Android bundle ID cambiato in: " + bundleId));
        });
    }
    changeIosAppName(appName, appPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let contentLineByLine = yield this.readFileAsLineByline({ filePath: appPath + "/" + this.iosInfoPlistPath });
            if (this.checkFileExists(contentLineByLine)) {
                console.log((0, utils_1.errorText)("iOS appname non può essere cambiato, il file non è stato trovato in: " + appPath + "/" + this.iosInfoPlistPath));
                return null;
            }
            for (let i = 0; i < contentLineByLine.length; i++) {
                if (contentLineByLine[i].includes('<key>CFBundleName</key>')) {
                    contentLineByLine[i + 1] = '\t<string>' + appName + '</string>\r';
                    break;
                }
            }
            for (let i = 0; i < contentLineByLine.length; i++) {
                if (contentLineByLine[i].includes('<key>CFBundleDisplayName</key>')) {
                    contentLineByLine[i + 1] = '\t<string>' + appName + '</string>\r';
                    break;
                }
            }
            yield this.writeFile({ filePath: appPath + "/" + this.iosInfoPlistPath, content: contentLineByLine.join('\n') });
            console.log((0, utils_1.successfulText)("iOS appname cambiato in: " + appName));
        });
    }
    changeAndroidAppName(appName, appPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let contentLineByLine = yield this.readFileAsLineByline({ filePath: appPath + "/" + this.androidManifestPath });
            if (this.checkFileExists(contentLineByLine)) {
                console.log((0, utils_1.errorText)("Android appname non può essere cambiato, il file non è stato trovato in: " + appPath + "/" + this.androidManifestPath));
                return null;
            }
            for (let i = 0; i < contentLineByLine.length; i++) {
                if (contentLineByLine[i].includes('android:label=')) {
                    contentLineByLine[i] = '        android:label=\"' + appName + '\"';
                    break;
                }
            }
            yield this.writeFile({ filePath: appPath + "/" + this.androidManifestPath, content: contentLineByLine.join('\n') });
            console.log((0, utils_1.successfulText)("Android appname cambiato in: " + appName));
        });
    }
    updateMainActivity() {
        return __awaiter(this, void 0, void 0, function* () {
            let path = yield this.findMainActivity();
            if (path != null) {
                //this.processMainActivity();
            }
        });
    }
    findMainActivity() {
        return __awaiter(this, void 0, void 0, function* () {
            let files = yield this.dirContents(this.pathActivity);
            for (let item in files) {
                console.log(item);
                /*if (item.isDirectory == false) {
                  if (item.path.endsWith('MainActivity.kt')) {
                    return item;
                  }
                }*/
            }
            return null;
        });
    }
    dirContents(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = [];
            return new Promise((resolve, reject) => {
                try {
                    const fileNames = fs_1.default.readdirSync(dir);
                    fileNames.forEach((fileName) => {
                        const filePath = path.join(dir, fileName);
                        const stats = fs_1.default.statSync(filePath);
                        files.push({ path: filePath, isDirectory: stats.isDirectory() });
                    });
                    resolve(files);
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
}
exports.FileRepository = FileRepository;
