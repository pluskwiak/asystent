import React from 'react';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import {PermissionsAndroid} from 'react-native';
import FsStream from 'react-native-fs-stream';
import {BleError} from "react-native-ble-plx";
import base64 from "base64-js";
import { Buffer } from 'buffer'

const ServiceUUID = "0000bcdf-1212-efde-1523-785fef13d123"//, "0000ffe5-0000-1000-8000-00805f9a34fb"];


function partial(func /*, 0..n args */) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var allArguments = args.concat(Array.prototype.slice.call(arguments));
    return func.apply(this, allArguments);
  };
}

function dimmWrapper(callback, dimmer) {
    let filter = 0;
    return (error, characteristics) => {
        if (error) {
            callback(error, characteristics);
        } else {
            if (filter === 0) {
                callback(error, characteristics);
            }
            filter = (filter + 1) % dimmer;
        }
    };
}

function DecodeJavaShort (number)
{

    let res = number;
    if (number> 32767)
    {
        res = number - 65536;
    }
    return res;
}

function decodeCharacteristicsValue(value, ratio) {
    const decoded = base64.toByteArray(value);

    let val1 = DecodeJavaShort((decoded[1] << 8) | (decoded[2]));
     
    let val2 = DecodeJavaShort((decoded[3] << 8) | (decoded[4]));
    
    let val3 = DecodeJavaShort((decoded[5] << 8) | (decoded[6]));

    val1 /= ratio;
    val2 /= ratio;
    val3 /= ratio;

    return {
        x: val1,
        y: val2,
        z: val3
    };
}

export default class BleFunction {
    eventHandler = null;
    context = null;
    analyzer = null;
    constructor(nfun,con,anl)
    {
        this.eventHandler = nfun;
        this.context = con;
        this.analyzer = anl;
    }

    async requestPermission() 
    {

        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            {
                title: 'Potrzebna zgoda na badanie lokalizacji',
                message:
                'Czy zgadzasz sie na przeszukanie otocznenia,'+
                'w celu wykrycia czujników?',
            },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the ACCESS_COARSE_LOCATION');
                LocationServicesDialogBox.checkLocationServicesIsEnabled({
                message: "Włączyć usługę lokalizacji, jest ona niezbędna do poszukiwania czujników ?",
                ok: "Tak",
                cancel: "Nie"
                });
            } else {
            console.log('ACCESS_COARSE_LOCATION permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    workInProgres = false;
    nuberOfAtempsToConnect = 0;
    async connectBleSensor (device)
    {   
        this.workInProgres = true;
        await device.connect().then((device) => {
                console.log (device);
                //const listedDevices = this.state.connectedDevices.push(device);
                return device.discoverAllServicesAndCharacteristics();
            })
            .then((device) => {
                return device.services();
            })
            .then((services) => {

                const service = services.find((service) => service.uuid === ServiceUUID);
                console.log(service);
                if (!service) {
                    console.log('Could not find service ' + ServiceUUID);
                }
                return service.characteristics();
            })
            .then((characteristics) => {
                const accelerometerCharacteristic = characteristics.find((c) => c.uuid.startsWith("0000000a"));
                
                if (!accelerometerCharacteristic) {
                    console.log('Could not find accelerometer characteristic');
                }
                
                const accelerometerWrapper = dimmWrapper((error, c) => this.handleAccelerometerChange(error, c), 8);
                const gyroscopeWrapper = dimmWrapper((error, c) => this.handleGyroscopeChange(error, c), 8);
                
                const gyroscopeCharacteristic = characteristics.find((c) => c.uuid.startsWith("0000000b"));
                if (!gyroscopeCharacteristic) {
                    console.log('Could not find gyroscope characteristic');
                }

                this.accelerometerSubscription = accelerometerCharacteristic.monitor((error, c) => accelerometerWrapper(error, c));
                this.gyroscopeSubscription = gyroscopeCharacteristic.monitor((error, c) => gyroscopeWrapper(error, c));
            })
            .catch((error) => {
               console.log (error);
               if (this.nuberOfAtempsToConnect<3)
               {
                  
                    this.nuberOfAtempsToConnect = this.nuberOfAtempsToConnect + 1;
                     console.log ("Nr of connection:" + this.nuberOfAtempsToConnect)
                    this.connectBleSensor (device);
               }
               else
               {
                   console.log ("Application was unable to connet the device");
                   this.nuberOfAtempsToConnect = 0;
               }
               this.workInProgres = false;
               return false;
            });   
            
    }

    handleAccelerometerChange(error, characteristic) {
        
        if (error) {
            this.handleBleError(error);
        } else {
            this.handleCharacteristicChange(characteristic.value, "accelerometer", characteristic.deviceID, 16384);
        }
    }
    
    handleGyroscopeChange(error, characteristic) {
        if (error) {
            this.handleBleError(error);
        } else {
            this.handleCharacteristicChange(characteristic.value, "gyroscope", characteristic.deviceID, 131);
        }
    }



    handleCharacteristicChange(value, stateKey, deviceID, ratio) {
        
        
        if (this.eventHandler != null)
        {
            var fr;
            let sample, samples;
            switch (stateKey) {
                case "accelerometer":

                    sample = decodeCharacteristicsValue(value, ratio);
 
                    samples = {akc: sample, gyr: null, mag: null}

                    var fr = partial(this.eventHandler,samples, deviceID, this.context, this.analyzer);

                    // now, when you invoke fr() it will invoke f(1,2,3)
                    fr();  
                    break;
                case "gyroscope":
                    sample = decodeCharacteristicsValue(value, ratio);

                    samples = {akc: null, gyr: sample, mag: null}

                    fr = partial(this.eventHandler,samples, deviceID, this.context, this.analyzer);

                    // now, when you invoke fr() it will invoke f(1,2,3)
                    fr();  
                    break;
                default:
                    break;
            }
   
            
        }
    }

    handleBleError(error) {
        console.log ('BLE Error: ' + error.message);
    }

}