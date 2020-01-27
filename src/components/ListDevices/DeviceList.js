import React from 'react';
import {FlatList, StyleSheet, Text, ToastAndroid, View, PermissionsAndroid} from 'react-native';

import TextBanner from '../Banner/TextBanner';
import TextBannerButton from '../Banner/TextBannerButton';
import DeviceButton from "./DeviceButton";
import update from "immutability-helper";
import {BleManager} from 'react-native-ble-plx';
import BleFunction from '../BleFunction.js';

import * as RNFS from 'react-native-fs';





export default class DeviceList extends React.Component {

    static navigationOptions = {
        title: 'Skanowanie urządzeń',
    };

    constructor(props) {
        super(props);
        bleFunction = new BleFunction();
        bleFunction.requestPermission();
 
        this.manager = new BleManager();
        
        this.manager.enable('a');
        this.state = {
            devices: []
        }
    }

 
   
     componentDidMount() {
        
      
       this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                this.handleBleError(error);
            } else {
                this.handleDeviceScanned(device);
            }
        });
      
        this.setState((oldState) => update(oldState, {
            devices: {$set: []}
        }));
    }

    componentWillUnmount() {
       
      try{
        this.manager.stopDeviceScan();
        this.manager.destroy();
      }catch{}
    }

    render() {
        const {devices} = this.state;
        return (<View style={styles.container}>
            <TextBanner text={"Znaleziono: " + devices.length }/>
            <FlatList
                data={devices}
                renderItem={({item}) => (<DeviceButton pressStatus={false} device={item} onPress={() => this.handleDevicePressed(item)}/>)}
                keyExtractor={(item) => item.id}
            />
            <Text>Wybierz pluskwy...</Text>
            <TextBannerButton onPress={() => this.onReady()} text={"Zapisz"}/>
        </View>);
    }


    async saveSelectedDeviceList ()
    {
         const {devices} = this.state;
       // require the module
        var RNFS = require('react-native-fs');

        // create a path you want to write to
        // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
        // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
        var path = RNFS.DocumentDirectoryPath + '/listaPluskw.txt';
        
        console.log(path);

        var String = adresyMac = "";
        devices.forEach(device => {
          if (device.pressStatus)
          {
            adresyMac = adresyMac + device.id + "\n";
          }
        });
        console.log(adresyMac);
        // write the file
        await RNFS.writeFile(path, adresyMac, 'utf8')
          .then((success) => {
            console.log('FILE WRITTEN!');
            const {navigate} = this.props.navigation;
            navigate('Setting', { reload: true });
          })
          .catch((err) => {
            console.log(err.message);
          }); 
    } 

    onReady() {
       this.componentWillUnmount();
       this.saveSelectedDeviceList();


    };

    handleDeviceScanned(device) {
        const {devices} = this.state;
        if (devices.findIndex((dev) => dev.id === device.id) !== -1) {
            return;
        }
        device.pressStatus = false;
        this.setState((oldState) => update(oldState, {
            devices: {$push: [device]},
            }));
        
    }

    handleBleError(error) {
        ToastAndroid.show('BLE Error: ' + error.message, ToastAndroid.SHORT);
    }

    handleDevicePressed(device) {
      const {devices} = this.state;
      var index = devices.findIndex((dev) => dev.id === device.id)

      this.setState(state => {
        const devices = state.devices.map((item, j) => {
        if (j === index) {
         item.pressStatus = !item.pressStatus;
          return item;
        } else {
          return item;
        }
      });

      return {
        devices,
      };
    });

       
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
    }
});
