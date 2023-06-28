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
exports.FileRepository = void 0;
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
class FileRepository {
    constructor() {
        this.androidManifestPath = '.\\android\\app\\src\\main\\AndroidManifest.xml';
        this.iosInfoPlistPath = '.\\ios\\Runner\\Info.plist';
        this.androidAppBuildGradlePath = '.\\android\\app\\build.gradle';
        this.iosProjectPbxprojPath = '.\\ios\\Runner.xcodeproj\\project.pbxproj';
        this.launcherIconPath = '.\\assets\\images\\launcherIcon.png';
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
    changeIosBundleId({ bundleId }) {
        return __awaiter(this, void 0, void 0, function* () {
            let contentLineByLine = yield this.readFileAsLineByline({ filePath: this.iosProjectPbxprojPath });
            if (this.checkFileExists(contentLineByLine)) {
                console.log((0, utils_1.errorText)("iOS bundle ID non può essere cambiato, il file non è stato trovato in:" + this.iosProjectPbxprojPath));
                return null;
            }
            for (let i = 0; i < contentLineByLine.length; i++) {
                if (contentLineByLine[i].contains('PRODUCT_BUNDLE_IDENTIFIER')) {
                    contentLineByLine[i] = '				PRODUCT_BUNDLE_IDENTIFIER = ' + bundleId + ";";
                }
            }
            this.writeFile({ filePath: this.iosProjectPbxprojPath, content: contentLineByLine.join('\n') });
            console.log((0, utils_1.successfulText)("iOS bundle ID cambiato in:" + bundleId));
        });
    }
    changeAndroidBundleId({ bundleId }) {
        return __awaiter(this, void 0, void 0, function* () {
            let contentLineByLine = yield this.readFileAsLineByline({ filePath: this.androidAppBuildGradlePath });
            if (this.checkFileExists(contentLineByLine)) {
                console.log((0, utils_1.errorText)("Android bundle ID non può essere cambiato, il file non è stato trovato in:" + this.androidAppBuildGradlePath));
                return null;
            }
            for (let i = 0; i < contentLineByLine.length; i++) {
                if (contentLineByLine[i].contains('applicationId')) {
                    contentLineByLine[i] = '        applicationId \"' + bundleId + '\"';
                    break;
                }
            }
            this.writeFile({ filePath: this.androidAppBuildGradlePath, content: contentLineByLine.join('\n') });
            console.log((0, utils_1.successfulText)("Android bundle ID cambiato in:" + bundleId));
        });
    }
    changeIosAppName(appName) {
        return __awaiter(this, void 0, void 0, function* () {
            let contentLineByLine = yield this.readFileAsLineByline({ filePath: this.iosInfoPlistPath });
            if (this.checkFileExists(contentLineByLine)) {
                console.log((0, utils_1.errorText)("iOS appname non può essere cambiato, il file non è stato trovato in:" + this.iosInfoPlistPath));
                return null;
            }
            for (let i = 0; i < contentLineByLine.length; i++) {
                if (contentLineByLine[i].contains('<key>CFBundleName</key>')) {
                    contentLineByLine[i + 1] = '\t<string>' + appName + '</string>\r';
                    break;
                }
            }
            for (let i = 0; i < contentLineByLine.length; i++) {
                if (contentLineByLine[i].contains('<key>CFBundleDisplayName</key>')) {
                    contentLineByLine[i + 1] = '\t<string>' + appName + '</string>\r';
                    break;
                }
            }
            yield this.writeFile({ filePath: this.iosInfoPlistPath, content: contentLineByLine.join('\n') });
            console.log((0, utils_1.successfulText)("iOS appname cambiato in:" + appName));
        });
    }
    changeAndroidAppName(appName) {
        return __awaiter(this, void 0, void 0, function* () {
            let contentLineByLine = yield this.readFileAsLineByline({ filePath: this.androidManifestPath });
            if (this.checkFileExists(contentLineByLine)) {
                console.log((0, utils_1.errorText)("Android appname non può essere cambiato, il file non è stato trovato in:" + this.androidManifestPath));
                return null;
            }
            for (let i = 0; i < contentLineByLine.length; i++) {
                if (contentLineByLine[i].contains('android:label=')) {
                    contentLineByLine[i] = '        android:label=\"' + appName + '\"';
                    break;
                }
            }
            yield this.writeFile({ filePath: this.androidManifestPath, content: contentLineByLine.join('\n') });
            console.log((0, utils_1.successfulText)("Android appname cambiato in:" + appName));
        });
    }
}
exports.FileRepository = FileRepository;
