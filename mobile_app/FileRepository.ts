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

  async updateMainActivity() {
    let path = await this.findMainActivity();
    if (path != null) {
      //this.processMainActivity();
    }
  }

  async findMainActivity() {
    let files : Array<any> = await this.dirContents(this.pathActivity);
    for (let item in files) {
      console.log(item);
      /*if (item.isDirectory == false) {
        if (item.path.endsWith('MainActivity.kt')) {
          return item;
        }
      }*/
    }
    return null;
  }

  async dirContents(dir) : Promise<Array<any>> {
    const files = [];
    return new Promise((resolve, reject) => {
      try {
        const fileNames = fs.readdirSync(dir);
        fileNames.forEach((fileName) => {
          const filePath = path.join(dir, fileName);
          const stats = fs.statSync(filePath);
          files.push({ path: filePath, isDirectory: stats.isDirectory() });
        });
        resolve(files);
      } catch (error) {
        reject(error);
      }
    });
  }

  /*Future<void> processMainActivity(File path, String type) async {
    var extension = type == 'java' ? 'java' : 'kt';
    print('Project is using $type');
    print('Updating MainActivity.$extension');
    await replaceInFileRegex(path.path, '(package.*)', "package ${newPackageName}");

    String newPackagePath = newPackageName.replaceAll('.', '/');
    String newPath = '${PATH_ACTIVITY}${type}/$newPackagePath';

    print('Creating New Directory Structure');
    await Directory(newPath).create(recursive: true);
    await path.rename(newPath + '/MainActivity.$extension');

    print('Deleting old directories');

    await deleteEmptyDirs(type);
  }*/

}