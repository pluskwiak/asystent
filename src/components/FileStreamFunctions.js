
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import {PermissionsAndroid} from 'react-native';
import firebase from 'react-native-firebase';

export default class FileStreamFunctions {
    deviceResultFileStreams= {};
    date = '';
    DirPath = '';
    chanelsName = ['akc','gyr','mag']

    constructor()
    {   
        var today = new Date();
        this.date =''+ today.getFullYear()+(today.getMonth()+1)+today.getDate() + today.getHours() + today.getMinutes() + today.getSeconds();
        const dirs = RNFetchBlob.fs.dirs;
        this.DirPath = dirs.DocumentDir + '/trials/' + this.date + '/';
        RNFS.mkdir(this.DirPath);
        RNFS.writeFile(this.DirPath+'log.txt', '', 'utf8')
    }

    writeLog(line)
    {
      var today = new Date();
      
      RNFS.appendFile (this.DirPath+'log.txt',today.toString() + ', ' + today.getMilliseconds() + ' : ' + line + '\r\n','utf8');
      console.log (line);
    }

    openFileStream (path,name)
    {
        
        RNFetchBlob.fs.writeStream(path,`utf8`,true).then((fd) => {
            console.log("Creating stream: " + path);
            streamComponent = {stream: fd,
            buffoLength: 0,
            buffor: ""}
            this.deviceResultFileStreams[name]=streamComponent;
        }).catch((e) => console.log(e)); 
    }

    createDeviceStreams (deviceID)
    {
       
        
        fileID = deviceID.split(':').join('');
        for (i=0; i < this.chanelsName.length; i++)
        {
            let name = fileID + '_' + this.chanelsName[i];
            let fileName = this.DirPath + name + '.csv';
            RNFetchBlob.fs.createFile(fileName, '', 'utf8').then(
               () => {this.openFileStream (fileName, name);}
            );           
        }
    }

    convertToCSVLine (data)
    {
        return data.x + ';' + data.y + ';' + data.z + ';\n'
    }

    convertToByteArray(str)
    {
        let bytes = [];
        for (var i = 0; i < str.length; ++i) {
            var code = str.charCodeAt(i);
            bytes = bytes.concat([code & 0xff, code / 256 >>> 0]);
        }
        return bytes;
    }

    saveSampleInDeviceStream (sample,deviceID)
    {
        fileID = deviceID.split(':').join('');
        if (sample.akc != null)
        {
            let name = fileID + '_' + this.chanelsName[0];

            this.writeToStream(this.deviceResultFileStreams[name],(this.convertToCSVLine(sample.akc)));
            
        }

        if (sample.gyr != null)
        {
            let name = fileID + '_' + this.chanelsName[1];

            this.writeToStream(this.deviceResultFileStreams[name],(this.convertToCSVLine(sample.gyr)));
        }
        if (sample.mag != null)
        {
          let name = fileID + '_' + this.chanelsName[2];

            this.writeToStream(this.deviceResultFileStreams[name],(this.convertToCSVLine(sample.mag)));
        }      
    }


    writeToStream(streamComponent, line)
    {
     
      if (typeof streamComponent !== 'undefined') {

        streamComponent.buffoLength += 1;
        streamComponent.buffor += line;
        if (streamComponent.buffoLength == 30)
        {
          streamComponent.stream.write(streamComponent.buffor);
          streamComponent.buffor = "";
          streamComponent.buffoLength = 0;
        }
        
      }
        
    }

    async closeAllFileStreams ()
    {
        let Keys = Object.keys(this.deviceResultFileStreams);
        
        for (i = 0; i < Keys.length; i++)
        {
            console.log("Closing stream: ", Keys[i]);
            await this.deviceResultFileStreams[Keys[i]].stream.close();
        }
        
        this.deviceResultFileStreams = [];
    }



    async moveFileToExternalStorage(options, UID) 
    {
      ///console.log (options);
      //console.log (UID);
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Zapisać pliki",
            message: "Wymagana jest zgoda na zapis plików w pamięci urządzenia"
          }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Create a root reference to firebase storage
        var storageRef = firebase.storage().ref();

        let newDirPath = '/storage/emulated/0/AsystentPacjenta/'+ this.date + '/';
        const dirs = RNFetchBlob.fs.dirs;
        let olsDirPath = dirs.DocumentDir + '/trials/' + this.date + '/';
        
        
        RNFS.mkdir(newDirPath);

        RNFetchBlob.fs.ls(olsDirPath)
        // files will an array contains filenames
        .then((files) => {
            files.forEach(file => {
              let newFile = newDirPath+file;

              // Create a reference to 'images/mountains.jpg'
              
              
               storageRef.child('rawData/'+UID + '/' +  this.date + '/'+file).put(olsDirPath+file).then(function(snapshot) {
                 console.log('Uploaded a blob or file!');
              }).catch((err) => { console.log(err) });
              if (options[1].checked)
              {
                RNFetchBlob.fs.cp(olsDirPath+file, newFile)
                .then(() => { 
                  RNFetchBlob.fs.scanFile([{path : newFile, mime : 'text/plain'}])
                              })
                .catch((err) => { console.log(err) });
              }
              
            })

        })
        console.log("Permission granted, file copy to:", newDirPath)
        
      
      } else {
        console.log(
          "Permission Denied! File not move.",
          
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }
}