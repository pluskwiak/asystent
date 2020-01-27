import React, {Component} from 'react';
import {View, StyleSheet, Text, Platform, PermissionsAndroid, NativeModules, NativeEventEmitter} from 'react-native';
import TextBannerButton from "../Banner/TextBannerButton";
import update from 'immutability-helper';

import BleManager from 'react-native-ble-manager';

import TrialOption from '../TrialOption.js';
import FileStreamFunctions from '../FileStreamFunctions.js';
import MovmentAnalyser from '../MovmentAnalyser.js';

import { StackActions, NavigationActions } from 'react-navigation';

import TextReader from '../TextReader.js';
import SelectedList from './SelectedList.js';
import TapedIndicator from './TapedIndicator.js';   
import TrumpingIndicator from './TrumpingIndicator.js';   
import StandUpIndicator from './StundUpIndicator.js';   

import TapLImg1 from './TapBugLeft.png';
import TapLImg2 from './TapBugLeft2.png';
import TapRImg1 from './TapBugRight.png';
import TapRImg2 from './TapBugRight2.png';
import SitImg from './sit2.png'
import WalkImg from './walk.png';
import WearImg from './WearBug.png';

/*
const instructions = [  "Załóż pluskwy na ciało. Włącz czujniki. Gdy będziesz gotowy naciśnij przycisk start.", 
                        //"Poczekaj na połączenie z pluskwami", 
                        "Test tupania lewej nogi. Stuknij w pluskwę na lewej nodze.", "Dziękuję, rozpoczynamy test. Zacznij tupać lewą nogą.",
                        "Test tupania prawej nogi. Stuknij w pluskwę na prawej nodze.", "Dziękuję, rozpoczynamy test. Zacznij tupać prawą nogą.",
                        "Stuknij pluskę na klatce piersiowej.", "Proszę wstać z krzesła, starając się nie używać pomocy rąk podczas wstawania. Po całkowitym wyprostowaniu, proszę usiąść na krześle. Ćwiczenie należy powtórzyć 3 razy. ",
                        "Test chodu. Przejdź kilka kroków. Zawróć. Podejdź do telefonu i naciśnij koniec."];
const stepAnalize = [
    null,
    //null,
    'hitting',
    'tramp',
    'hitting',
    'tramp',
    'hitting',
    'standUp',
    null
]
*/

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
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

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function decodeCharacteristicsValue(value, ratio, MSBFirst = true) {
    let val1, val2, val3;
    if (MSBFirst)
    {
        val1 = DecodeJavaShort((value[1] << 8) | (value[2]));
     
        val2 = DecodeJavaShort((value[3] << 8) | (value[4]));
    
        val3 = DecodeJavaShort((value[5] << 8) | (value[6]));
    }
    else
    {
        val1 = DecodeJavaShort((value[2] << 8) | (value[1]));
     
        val2 = DecodeJavaShort((value[4] << 8) | (value[3]));
    
        val3 = DecodeJavaShort((value[6] << 8) | (value[5]));
    
    }


    val1 /= ratio;
    val2 /= ratio;
    val3 /= ratio;

    return {
        t: value[0],
        x: val1,
        y: val2,
        z: val3
    };
}


export default class Trial extends React.Component {

    static navigationOptions = {
        title: 'Próba',
    };

    state = { 
        options: [],
        UID: null,
        devicesInfo: [],
        instructionNumber: null,
        stageRenderData: 0,
        connectionButtonText: "Poczekaj na połączenie...",
        connectionButtoneenabled: false
    }
    reader = null;

    fileStreamFunctions = new FileStreamFunctions ();
    movmentAnalyser = null;
    resultArray = [];
    Descriptions = [
            {
                title: "Początek...",
                instruction: "Załóż pluskwy na ciało. Włącz czujniki. Gdy będziesz gotowy naciśnij przycisk start.",
                button: null,
                body: function(){return <TapedIndicator images={[WearImg]} text=""/>;},
                stepAnalize: null,
                instructionstoRead: "Załóż pluskwy na ciało. Włącz czujniki. Gdy będziesz gotowy naciśnij przycisk start."
            },
            /*{
                title: "Łaczenie...",
                instruction: "Poczekaj na połaczenie.",
                button: "Pomiń",
                body: <SelectedList text=" Znalezione pluskwy:" itemsList={this.state.devicesInfo}/>,
                stepAnalize: null,
                instructionstoRead: "Poczekaj na połączenie z pluskwami"
            },*/
            {
                title: "Test tupania lewej nogi",
                instruction: "Stuknij w pluskwę na lewej nodze.",
                button: "Pomiń",
                body: function(){return <TapedIndicator images={[TapLImg1,TapLImg2]} text=""/>},
                stepAnalize: 'hitting',
                instructionstoRead:  "Test tupania lewej nogi. Stuknij w pluskwę na lewej nodze."
            },
            {
                title: "Test tupania lewej nogi",
                instruction: "Zacznij tupać lewą nogą.\nOceniana jest amplituda, szybkośc i rytmiczność ruchu nogi.\nMasz za zadanie wykonąć 20 tupnięć.",
                button: "Gotowe",
                body: function(st){return <TrumpingIndicator  text={st.stageRenderData + "/ 20"} position='50%'/>},
                stepAnalize: 'tramp',
                instructionstoRead: "Dziękuję, rozpoczynamy test. Zacznij tupać lewą nogą."
            },
            {
                title: "Test tupania prawej nogi",
                instruction: "Stuknij w pluskwę na prawej nodze.",
                button: "Pomiń",
                body: function(){return <TapedIndicator images={[TapRImg1,TapRImg2]} text=""/>},
                stepAnalize: 'hitting',
                instructionstoRead: "Test tupania prawej nogi. Stuknij w pluskwę na prawej nodze."
            },
            {
                title: "Test tupania prawej nogi",
                instruction: "Zacznij tupać lewą nogą.\nOceniana jest amplituda, szybkośc i rytmiczność ruchu nogi.\nMasz za zadanie wykonąć 20 tupnięć.",
                button: "Gotowe",
                body: function(st){return <TrumpingIndicator  text={st.stageRenderData + "/ 20"} position='50%'/>},
                stepAnalize: 'tramp',
                instructionstoRead: "Dziękuję, rozpoczynamy test. Zacznij tupać prawą nogą."
            },
            {
                title: "Test wstawania",
                instruction: "Stuknij w pluskwę na klatce piersiowej.",
                button: "Pomiń",
                body: function(){return <TapedIndicator images={[TapLImg1,TapLImg2]} text=""/>},
                stepAnalize: 'hitting',
                instructionstoRead: "Stuknij pluskę na klatce piersiowej."
            },
            {
                title: "Test wstawania",
                instruction: "Proszę wstać z krzesła, starając się nie używać pomocy rąk podczas wstawania. Po całkowitym wyprostowaniu, proszę usiąść na krześle. Ćwiczenie powtórzyć 3 razy.",
                button: "Gotowe",
                body: function(st){return <StandUpIndicator text={"Wykryto zmian pozycji: \n" + st.stageRenderData + "/ 6"} />},
                stepAnalize: 'standUp',
                instructionstoRead: "Proszę wstać z krzesła, starając się nie używać pomocy rąk podczas wstawania. Po całkowitym wyprostowaniu, proszę usiąść na krześle. Ćwiczenie należy powtórzyć 3 razy. "
            },
            {
                title: "Test chodu",
                instruction: "Test chodu. Przejdź kilka kroków. Zawróć. Wróć do telefonu i naciśnij guzik koniec.",
                button: "Koniec",
                body: function(){return <TapedIndicator images={[SitImg,WalkImg]} text=""/>},
                stepAnalize: null,
                instructionstoRead:  "Test chodu. Przejdź kilka kroków. Zawróć. Podejdź do telefonu i naciśnij koniec."
            }
        ];

    constructor(props) {
        super(props);
       
        notyfiationIteration = 0;
		start = 0;
        end = 0;
        //this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
	    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
        this.movmentAnalyser = new MovmentAnalyser(this.handleMovmentAnalizerEvent.bind(this));
        this.allDevicesWasFinded = false;
        TrialOption.readSetting().then(
            newState =>{
            deviceIds = newState.options.pluskwy.split('\n');  
            
            deviceIds.pop();
            var devices = [];
           
            deviceIds.forEach(id => {
                var element = {
                    id: id ,
                    finded: false
                }

                devices.push (element);
                //console.log (element);
            });
            console.log (newState);
            this.setState(
                {
                    options: newState.options.Options,
                    UID: newState.options.UID,
                    devicesInfo: devices,
                    instructionNumber: 0
                });
            if (newState.options.Options[0].checked)
            {
                let readInstruction = [];
                this.Descriptions.forEach((element)=>{
                        readInstruction.push(element.instructionstoRead)
                })
                this.reader = new TextReader (readInstruction);
                console.log (this.reader);
                this.reader.readInstruction(0);                
            }
            
        });
   }
  
  componentDidMount()
  {
    //this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );
    BleManager.enableBluetooth({showAlert: false, forceLegacy: true})
    .then(() => {  
      // Success code
      console.log('The bluetooth is already enabled or the user confirm');
      if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }
      BleManager.start({ showAlert: false,forceLegacy: true }).then(() => {
       // Success code
      console.log('Module initialized');
      
        BleManager.getConnectedPeripherals([])
            .then((peripheralsArray) => {
                console.log(peripheralsArray);
            
                                       
            
            })
      BleManager.scan([], 7, true)
        .then(() => {
        // Success code
        console.log('Scan started');
      });
    });
    
    })
    .catch((error) => {
    // Failure code
      console.log(error);
    }); 
   }
   
    trys = 0;
    async startNotification(peripheral, character)
    {
        
       await BleManager.startNotification(peripheral.id, character.service, character.characteristic)
                        .then(() => {
                        // Success code

                        this.fileStreamFunctions.writeLog('Notification started:' + character.characteristic);

                       
                        })
                        .catch((error)=>{
 
                            if (this.trys < 6)
                            {
                                this.fileStreamFunctions.writeLog(error); 
                               
                                sleep(500).then(()=> {
                                    this.fileStreamFunctions.writeLog("try:" + this.trys);
                                    this.trys += 1; 
                                    this.startNotification(peripheral, character);
                                });
                               
                            }else 
                            {
                                return Promise.resolve();
                            }
                        });  
    }
   
    
    services = ['0000bcdf-1212-efde-1523-785fef13d123','0000ffe5-0000-1000-8000-00805f9a34fb'];
    
    
    async connectBleSensor(peripheral, cb)
    {   
        this.fileStreamFunctions.writeLog('Connecting: ' + peripheral.id);
        BleManager.isPeripheralConnected(peripheral.id, [])
        .then((isConnected) => {
            if (!isConnected) {
                
      
                    BleManager.connect(peripheral.id)
                    .then(async() => {
                        // Success code
                        BleManager.requestConnectionPriority(peripheral.id, 1);
                            
                        await this.fileStreamFunctions.createDeviceStreams(peripheral.id);
                        await this.movmentAnalyser.addDeviceAnalyzer(peripheral.id);
                   
                        cb();
                    })
                    .catch((error) => {
                        // Failure code
                        
                        this.fileStreamFunctions.writeLog(error); 
                        if (this.trys < 6)
                        {                       
                            sleep(20).then(()=> {
                                this.fileStreamFunctions.writeLog("try:" + this.trys);
                                this.trys += 1; 
                                this.connectBleSensor(peripheral,cb);
                            });
                        }
                        else
                        {
                            cb();
                        }
                    });
        
    
                   
            } 
            else {
                cb();
                console.log('Peripheral is connected!'+ peripheral.id);
            }
        });  
      
    }

   connectAll ()
   {
       let requests = this.state.devicesInfo.reduce((promiseChain, item) => {
            return promiseChain.then(() => new Promise((resolve) => 
            {
                this.connectBleSensor(item, resolve);
            }));
        }, Promise.resolve());

        requests.then(async ()=> 
        {

            console.log('Done');
                
            BleManager.getConnectedPeripherals([])
            .then((peripheralsArray) => {
                            
            try 
            {
                peripheralsArray.forEach(async (peripheral)=>{

                    await BleManager.retrieveServices(peripheral.id)
                    .then((peripheralInfo) => {
                        peripheralInfo.characteristics.forEach(async (character)=>
                        {

                            if (this.services.indexOf(character.service)>-1)
                            {
                                
                                
                               if(character.properties.Write == 'Write')
                                {
                                    let data = [0xFF, 0xAA, 0x03, 0x08, 0x00];
                                    console.log(character.characteristic);
                                    
                                     writeFS =new Promise((resolve) => {BleManager.writeWithoutResponse(peripheral.id, character.service, character.characteristic, data)
                                      .then(() => {
                                        // Success code
                                        console.log('Writed: ' + data);
                                     })
                                    .catch((error) => {console.log(error)})});
                                    
                                   await writeFS;
                                    
                                }
                            }
                        });
                            //write() never succeed while notification on #154 (BleMenager behavior)
                        peripheralInfo.characteristics.forEach(async (character)=>{

                            if (this.services.indexOf(character.service)>-1)
                            {
                                if(character.properties.Notify == 'Notify')
                                {
                                        startnotyfi =new Promise((resolve) => this.startNotification(peripheral, character));
                                        await startnotyfi;
                                        console.log(character.properties)
                                }  
                                
                            }
                                        
                        });
                    }).catch((err) =>{
                        this.fileStreamFunctions.writeLog(err);

                    });  

                 }); 
                                         
            }
            catch(err) {
                this.fileStreamFunctions.writeLog(err);
            }                  
            });
         });
    }



    allDevicesWasFinded = false;

    

    allDevicesFinded()
    {
            console.log (this.state.devicesInfo);
            this.allDevicesWasFinded = true;

            this.fileStreamFunctions = null;
            this.fileStreamFunctions = new FileStreamFunctions ();
            this.setState({
                connectionButtonText: "Łącze..."
            })
            this.connectAll ();
            let id = setInterval(()=>{
   
                BleManager.getConnectedPeripherals([])
                .then((peripheralsArray) => {
                            
                            console.log ("Nr of connected:", peripheralsArray.length, "/", this.state.devicesInfo.length);
                            if (peripheralsArray.length>=this.state.devicesInfo.length)
                            {
   
                                clearInterval(id);
                                this.setState({
                                        connectionButtonText: "Start",
                                        connectionButtoneenabled: true
                                })   
                            }
                           
                    });
            } ,5000);
         
     
    }
/*
doesAllDevicesWasFinded()
    {
        var result = true;
        this.state.devicesInfo.forEach(element => {
            result = result && element.finded;
        });
        console.log (result)
        return result;
    }
    handleDiscoverPeripheral(peripheral){
        const index = this.state.devicesInfo.findIndex((dev) => dev.id === peripheral.id);  
        if (index !== -1) {
            if (!this.state.devicesInfo[index].finded)
            {
                this.state.devicesInfo[index].finded = true;
            }
                    
                updateState = false;
                    var devices = this.state.devicesInfo.map((item, j) => {
                        if (j === index) {
                            console.log ("Finded: " + peripheral.id);                           
                            item.finded = true;
                            item.devices = peripheral;
                            updateState = true;
                            return item;
                        } 
                        else 
                        {
                            return item;
                        }
                    });
                if (updateState){
                    this.setState({
                        devicesInfo: devices});}         
        }
        
        this.allDevicesFinded();
       
        
    }
*/
    handleStopScan()
    {
        let matched = 0;
        BleManager.getDiscoveredPeripherals([])
        .then((peripheralsArray) => {
            peripheralsArray.forEach((peripheral)=> {
                const index = this.state.devicesInfo.findIndex((dev) => dev.id === peripheral.id);  
                if (index !== -1) {
                    matched = matched + 1;
                }
            })
            // Success code
            console.log('Discovered peripherals: ' + matched +' / '+ this.state.devicesInfo.length);

            if (matched == this.state.devicesInfo.length)
            {
                console.log ('Scan stop');  
                this.allDevicesFinded(); 
            }
            else{
    
                BleManager.scan([], 10, true)
                .then(() => {
                    // Success code
                    console.log('Scan started');
                });
            }
            
        });
        
        
        
    }
    
    handleBleError(error) {
        ToastAndroid.show('BLE Error: ' + error.message, ToastAndroid.SHORT);
    }

    start=0;
    end=0;
    notyfiationIteration=0;

    handleUpdateValueForCharacteristic(notification)
    {    
       
        switch (notification.characteristic) {
            case "0000000a-1212-efde-1523-785fef13d123":
                sample = decodeCharacteristicsValue(notification.value, 16384);
                samples = {akc: sample, gyr: null, mag: null}
                break;
            case "0000000b-1212-efde-1523-785fef13d123":
                sample = decodeCharacteristicsValue(notification.value, 131);
                samples = {akc: null, gyr: sample, mag: null}
                break;
            case '0000ffe4-0000-1000-8000-00805f9a34fb':
                const akc = decodeCharacteristicsValue(notification.value.slice(1, 8),2048,false);;
                const gyr = decodeCharacteristicsValue(notification.value.slice(8, 15),16.385,false);
                const mag = decodeCharacteristicsValue(notification.value.slice(13),182,false);
                //this.notyfiationIteration += 1;
                samples = {akc: akc, gyr: gyr, mag: mag}
                break;
            default:
                break;
        }
        if (this.movmentAnalyser!= undefined)
        {
            this.movmentAnalyser.addSample(samples,notification.peripheral);
            this.fileStreamFunctions.saveSampleInDeviceStream(samples, notification.peripheral);
        }
        /*
         if (this.notyfiationIteration == 0)
        {
            this.start = Date.now();
        }
           
        if (this.notyfiationIteration == 40)
        {
            this.end = Date.now();
            let timeInterval = (this.end-this.start)/1000;
     
            
            console.log (timeInterval);
            this.notyfiationIteration = 0;
        }
       */
    }


    async clearBLE ()
    {
        
        try{
            BleManager.stopScan();

            await this.handlerStop.remove();
            await this.handlerUpdate.remove();

            await sleep(500);
            
            BleManager.getConnectedPeripherals([])
            .then((peripheralsArray) => {
                
                peripheralsArray.forEach(async (dev) => {  
                      
                        await  BleManager.disconnect(dev.id).then(()=>{
                     
                        this.fileStreamFunctions.writeLog ("Disconected: " + dev.id);
                        
                    });
                    await sleep(100);
                });
            });
            this.fileStreamFunctions.closeAllFileStreams();
            this.fileStreamFunctions.moveFileToExternalStorage(this.state.options, this.state.UID);
        }catch{} 
        
        
    }

    componentWillUnmount() {
        this.clearBLE();    
    }

    nextStep(stepSize = 1)
    {
      
        if (this.state.instructionNumber<(this.Descriptions.length-1))
        {
            const step = this.state.instructionNumber + stepSize;
            this.setState({instructionNumber: step,
                stageRenderData: 0});
            this.movmentAnalyser.setTypeAnalize(this.Descriptions[step].stepAnalize);
            this.fileStreamFunctions.writeLog ('analize typ: '+ this.Descriptions[step].stepAnalize);
            if (this.reader!=null)
            {
                this.reader.readInstruction(step);
            }
        }
        else
        {   

            console.log (this.resultArray);
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'TrialResult', params: {results: this.resultArray}})],
            });
            this.props.navigation.dispatch(resetAction);
        }
    }

    handleMovmentAnalizerEvent ()
    {
            switch (this.Descriptions[this.state.instructionNumber].stepAnalize) 
            {
                case 'hitting':  
                    this.fileStreamFunctions.writeLog ('taped: ' + this.movmentAnalyser.activeDevice);         
                    this.nextStep();
                    break;
                case 'tramp':
                    this.fileStreamFunctions.writeLog ('tramp: ' + this.movmentAnalyser.counter);
                    this.setState({stageRenderData: this.movmentAnalyser.counter});

                    if (this.movmentAnalyser.counter>=20)
                    {
                        this.resultArray.push({label: this.Descriptions[this.state.instructionNumber].title + ': ', text: 'Średni czas tupnięcia: ', value: (this.movmentAnalyser.agregateResults.mean()).toFixed(3)}); 
                        this.nextStep();
                    }
                    break;
                case 'standUp':
                    this.fileStreamFunctions.writeLog ('standUp: ' + this.movmentAnalyser.counter);
                    this.setState({stageRenderData: this.movmentAnalyser.counter});

                    if (this.movmentAnalyser.counter>=6)
                    {        
                        this.resultArray.push({label: this.Descriptions[this.state.instructionNumber].title + ': ', text: 'Średni czas w jakim zmieniałeś pozycję: ', value: (this.movmentAnalyser.agregateResults.mean()*0.05).toFixed(2)}); 
                        this.nextStep();
                    }
                    break;
                default:
                    break;
            }
    }


    render() {
      
        var index;
        if (this.state.instructionNumber == undefined)
        {
            index = 0;
        }
        else
        {
            index = this.state.instructionNumber;
        }
        

        if (this.Descriptions[index].button != null)
        {
            let stepLength = 1;
            if (this.Descriptions[index].stepAnalize== 'hitting')
            {
                stepLength = 2;
            }
            butt = <TextBannerButton text={this.Descriptions[index].button} onPress={() => this.nextStep(stepLength)}/>
        }
        else
        {
            if (this.state.connectionButtoneenabled)
            {
                butt = <TextBannerButton text={this.state.connectionButtonText} onPress={() => this.nextStep()}/>
            }
            else
            {
                let nullOk = function() {};
                butt = <TextBannerButton text={this.state.connectionButtonText} onPress={() =>nullOk}/>
            }
            
        }
        body = this.Descriptions[index].body(this.state);
        return (    
            <View style={styles.container}>
                <TextBanner text={this.Descriptions[index].title}/>
                <Text style={styles.infoText}>{this.Descriptions[index].instruction}</Text>
                {body}
                {butt}               
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        paddingTop: 20
    },
    infoText: {
        width: '90%',
        color: '#212121',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 16,
        marginTop: 16
    }
});
