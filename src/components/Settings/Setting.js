import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CheckBox} from 'react-native-elements';
import * as RNFS from 'react-native-fs';
import TrialOption from '../TrialOption.js';
import MenuHeader from '../MainMenu/MenuHeader';
import update from "immutability-helper";
import GreetingButton from "../GreetingScreen/GreetingButton";
import SaveImg from './save.png';
import BannerButton from "../Banner/BannerButton";
import ble from '../ListDevices/bluetooth_unclick.png'



export default class SettingScreen extends React.PureComponent {

    static navigationOptions = {
        title: 'Ustawienia',
    };
    state = { pluskwy: "",
                UID: null,
              Options:[
                {name: 'Czytaj polecenia', checked: false},
                {name: 'Zapisz dane w telefonie', checked: false}
             ]
    }


    componentWillReceiveProps() {
        var path = RNFS.DocumentDirectoryPath + '/listaPluskw.txt';
         RNFS.readFile(path, 'utf8')
        .then((contents) => {    
            console.log(contents);
            this.setState({pluskwy: contents});
         
                        
        })
        .catch((err) => {
            console.log(err.message, err.code);

                        
        });
      
    }

    

    constructor(props) {
        super(props);
       
        const { navigation } = this.props;
        const userId = navigation.getParam('uid', 'NO-ID');

         
       console.disableYellowBox = true;
    
        TrialOption.readSetting().then(
            newState =>{
            newState.options.UID = userId; 
            this.setState(this.state = newState.options);
            console.log (newState);
            
            });
            

        
        
    };

    render() {
        let deviceList;
        if (this.state.pluskwy.length > 0)
                   { 
                    deviceList =<Text style={styles.Text}>Wybrane czujniki:{"\n"+this.state.pluskwy+"\n"}</Text>;
                   }
                   else
                   {
                   deviceList = <Text style={styles.Text}>Nie wybrano czujników!</Text>;
                   }
        return (
            <View style={styles.container}>
            <GreetingButton text="Wybierz urządzenia" img={ble} onPress={() => this.selectDevices()}/>
                
                {deviceList}
                {
                    this.state.Options.map((question, idx) =>
                        <CheckBox
                            key={idx}
                            onPress={() => this.onClick(idx)}
                            title={question.name}
                            checked={question.checked}
                        />)
                }

                <GreetingButton text="Gotowe" img={SaveImg} onPress={() => this.saveSetting()}/>
            </View>)
    }

    onClick(idx) {
        this.setState((oldState) => update(oldState, {
            Options: {
                [idx]: {
                    checked: {$apply: (oldValue) => !oldValue}
                }
            }
        }));
    }

    selectDevices() {
        const {navigate} = this.props.navigation;
        this.props.navigation.navigate('Scan');

    }

    saveSetting() {
        

        TrialOption.saveSetting(this.state);
          
        const {navigate} = this.props.navigation;
        this.props.navigation.navigate('GreetingScreen');

    }
   
}

const styles = StyleSheet.create({
    Text: {
        fontWeight: 'bold', 
        textAlign: 'center'},
    container: {
        flex: 1,
        
    }
});
