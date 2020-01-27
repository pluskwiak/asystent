import * as RNFS from 'react-native-fs';

export default class TrialOption {
    state = {
            
    }
    options = {}
    static readSetting ()
    {
        var path = RNFS.DocumentDirectoryPath + '/ustawienia.txt';
        return RNFS.readFile(path, 'utf8')
        .then((contents) => {    
            this.state = JSON.parse(contents);
            //console.log(this.state);
            return new TrialOption(this.state);
                        
        })
        .catch((err) => {
            console.log(err.message, err.code);
            return null;
                        
        });
        
        
    }

    static async saveSetting(state) {
      const toSave = JSON.stringify(state);
      console.log(toSave);
      var RNFS = require('react-native-fs');

        // create a path you want to write to
        // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
        // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
      var path = RNFS.DocumentDirectoryPath + '/ustawienia.txt';
        
      console.log(path);
        // write the file
      await RNFS.writeFile(path, toSave, 'utf8')
          .then((success) => {
            console.log('FILE WRITTEN!');
      })
      .catch((err) => {
       console.log(err.message);
      }); 
  }  
  
 constructor(async_param) {
    if (typeof async_param === 'undefined') {
            throw new Error('Cannot be called directly');
        }
    else
    {
      this.options = async_param;
    }
  }
}
