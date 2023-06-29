import fs                            from 'fs';
import { errorText, successfulText } from './utils';
import * as path                 from 'path';

export class FileRepository {
  androidManifestPath : string = '.\\android\\app\\src\\main\\AndroidManifest.xml';
  iosInfoPlistPath : string = '.\\ios\\Runner\\Info.plist';
  androidAppBuildGradlePath : string = '.\\android\\app\\build.gradle';
  iosProjectPbxprojPath : string = '.\\ios\\Runner.xcodeproj\\project.pbxproj';
  launcherIconPath : string = '.\\assets\\images\\launcherIcon.png';
  pathActivity = 'android/app/src/main/kotlin';

  constructor() {
    if (process.platform == "linux" || process.platform == "darwin") {
      this.androidManifestPath = 'android/app/src/main/AndroidManifest.xml';
      this.iosInfoPlistPath = 'ios/Runner/Info.plist';
      this.androidAppBuildGradlePath = 'android/app/build.gradle';
      this.iosProjectPbxprojPath = 'ios/Runner.xcodeproj/project.pbxproj';
      this.launcherIconPath = 'assets/images/launcherIcon.png';
    }
  }

  checkFileExists(fileContent : Array<any>) {
    return fileContent == null || fileContent.length == 0;
  }

  async readFileAsLineByline ({filePath}: {filePath:string}) {
    try {
      let fileAsString = fs.readFileSync(filePath).toString();
      return fileAsString.split('\n');
    } catch (e) {
      return null;
    }
  }

  writeFile ({filePath, content} : {filePath: string, content: string}) {
    fs.writeFileSync(filePath, content);
  }

  async changeIosBundleId({bundleId, appPath} : {bundleId: string, appPath: string}) {
    let contentLineByLine : Array<any> = await this.readFileAsLineByline({filePath: appPath + "/" + this.iosProjectPbxprojPath});
    if (this.checkFileExists(contentLineByLine)) {
      console.log(errorText("iOS bundle ID non può essere cambiato, il file non è stato trovato in: " + appPath + "/" + this.iosProjectPbxprojPath));
      return null;
    }

    for (let i = 0; i < contentLineByLine!.length; i++) {
      if (contentLineByLine[i].includes('PRODUCT_BUNDLE_IDENTIFIER')) {
        contentLineByLine[i] = '				PRODUCT_BUNDLE_IDENTIFIER = ' + bundleId + ";";
      }
    }
    this.writeFile({filePath: appPath + "/" + this.iosProjectPbxprojPath, content: contentLineByLine.join('\n')});
    console.log(successfulText("iOS bundle ID cambiato in: " + bundleId));
  }

  async changeAndroidBundleId ({bundleId, appPath}: {bundleId: string, appPath: string}) {
    let contentLineByLine : Array<any> = await this.readFileAsLineByline({filePath: appPath + "/" + this.androidAppBuildGradlePath});
    if (this.checkFileExists(contentLineByLine)) {
      console.log(errorText("Android bundle ID non può essere cambiato, il file non è stato trovato in: " + appPath + "/" + this.androidAppBuildGradlePath));
      return null;
    }
    for (let i = 0; i < contentLineByLine!.length; i++) {
      if (contentLineByLine[i].includes('applicationId')) {
        contentLineByLine[i] = '        applicationId \"' + bundleId + '\"';
        break;
      }
    }
    this.writeFile({filePath: appPath + "/" + this.androidAppBuildGradlePath, content: contentLineByLine.join('\n')});
    console.log(successfulText("Android bundle ID cambiato in: " + bundleId));
  }

  async changeIosAppName(appName: string, appPath: string) {
    let contentLineByLine : Array<any> = await this.readFileAsLineByline({filePath: appPath + "/" + this.iosInfoPlistPath});
    if (this.checkFileExists(contentLineByLine)) {
      console.log(errorText("iOS appname non può essere cambiato, il file non è stato trovato in: " + appPath + "/" + this.iosInfoPlistPath));
      return null;
    }

    for (let i = 0; i < contentLineByLine!.length; i++) {
      if (contentLineByLine[i].includes('<key>CFBundleName</key>')) {
        contentLineByLine[i + 1] = '\t<string>' + appName + '</string>\r';
        break;
      }
    }

    for (let i = 0; i < contentLineByLine!.length; i++) {
      if (contentLineByLine[i].includes('<key>CFBundleDisplayName</key>')) {
        contentLineByLine[i + 1] = '\t<string>' + appName + '</string>\r';
        break;
      }
    }

    await this.writeFile({filePath: appPath + "/" + this.iosInfoPlistPath, content: contentLineByLine.join('\n')});
    console.log(successfulText("iOS appname cambiato in: " + appName));
  }

  async changeAndroidAppName(appName: string, appPath: string) {
    let contentLineByLine : Array<any> = await this.readFileAsLineByline({filePath: appPath + "/" + this.androidManifestPath});
    if (this.checkFileExists(contentLineByLine)) {
      console.log(errorText("Android appname non può essere cambiato, il file non è stato trovato in: " + appPath + "/" + this.androidManifestPath));
      return null;
    }
    for (let i = 0; i < contentLineByLine!.length; i++) {
      if (contentLineByLine[i].includes('android:label=')) {
        contentLineByLine[i] = '        android:label=\"' + appName + '\"';
        break;
      }
    }
    await this.writeFile({filePath: appPath + "/" + this.androidManifestPath, content: contentLineByLine.join('\n')});
    console.log(successfulText("Android appname cambiato in: " + appName));
  }

  async updateMainActivity(appPath: string, identifier: string) {
    let path = await this.findMainActivity(appPath);
    if (path != null) {
      await this.processMainActivity(appPath + "/" + this.pathActivity, path.path, identifier);
    }
  }

  async findMainActivity(appPath: string) {
    let files : Array<any> = await this.dirContents(appPath + "/" + this.pathActivity);
    for (let i = 0; i < files.length; i++) {
      if (files[i].isDirectory == false) {
        if (files[i].path.endsWith('MainActivity.kt')) {
          return files[i];
        }
      }
    }
    return null;
  }

  async dirContents(dir) : Promise<Array<any>> {
    const files = [];
    return new Promise((resolve, reject) => {
      try {
        const fileNames = fs.readdirSync(dir, {recursive: true});
        fileNames.forEach((fileName) => {
          const filePath = path.join(dir, fileName.toString());
          const stats = fs.statSync(filePath);
          files.push({ path: filePath, isDirectory: stats.isDirectory() });
        });
        resolve(files);
      } catch (error) {
        reject(error);
      }
    });
  }

  async processMainActivity(folderPath, path, newBundleId) {
    const newPackageNameRegex = /(package.*)/;
    const fileContents = await fs.promises.readFile(path, 'utf-8');
    const updatedFileContents = fileContents.replace(newPackageNameRegex, `package ${newBundleId}`);
    await fs.promises.writeFile(path, updatedFileContents, 'utf-8');

    console.log(successfulText("Aggiornato file MainActivity.kt"));

    const newPackagePath = newBundleId.toString().replace('.', '/');
    const newPath = `${folderPath}/${newPackagePath}`;

    await fs.promises.mkdir(newPath, { recursive: true });
    await fs.promises.rename(path, `${newPath}/MainActivity.kt`);

    console.log(successfulText('Aggiornata struttura di cartelle in base al nuovo bundleId'));

    await this.deleteEmptyDirs(folderPath);
  }

  async deleteEmptyDirs(folderPath) {
    const dirs = await this.dirContents(folderPath);
    const reversedDirs = dirs.reverse();

    for (const dir of reversedDirs) {
      if (dir.isDirectory) {
        const files = fs.readdirSync(dir.path);
        if (files.length === 0) {
          fs.rmdirSync(dir.path);
        }
      }
    }
  }

  async addIgnoredFiles(folderPath, fileName, android: boolean | null) {
    const sourceFilePath = path.join(__dirname, android == true ? 'ignoredFiles/android' : android == false ? 'ignoredFiles/ios' : 'ignoredFiles', fileName);
    fs.copyFile(sourceFilePath, folderPath + "/" + fileName, (error) => {
      if (error) {
        console.log(errorText('Si è verificato un errore durante la copia del file: ' + error));
      }
    });
  }

  async editInformationForIgnoredFiles(filePath, oldString, newString) {
    let contentLineByLine : Array<any> = await this.readFileAsLineByline({filePath: filePath});
    for (let i = 0; i < contentLineByLine!.length; i++) {
      if (contentLineByLine[i].includes(oldString)) {
        contentLineByLine[i] = newString;
        break;
      }
    }
    await this.writeFile({filePath: filePath, content: contentLineByLine.join('\n')});
  }
}