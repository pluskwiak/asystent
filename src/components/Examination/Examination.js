import React from 'react';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import update from 'immutability-helper';

import firebase from 'react-native-firebase';

import {BleManager} from 'react-native-ble-plx';

import InfoPanel from "./InfoPanel";
import DeviceList from "./DeviceList";
import ExerciseInfoPanel from "./ExerciseInfoPanel";
import Exercise from "./Excercise";

import SitImg from './sit2.png'
import WalkImg from './walk.png';
import UpImg from './up.png';
import DownImg from './down.png';

const Exercises = [
    {
        number: 1,
        name: 'Timed Up and Go',
        abbreviation: 'TUG',
        info: 'Proszę usiąść na krześle. W wybranym momencie proszę uruchomić rejestrację sygnału. ' +
            'Następnie proszę wstać z krzesła, zrobić około 10 kroków, obrócić się w miejscu i wrócić na krzesło. ' +
            'Następnie proszę zakończyć rejestrację sygnału W zadaniu oceniana jest szybkość zmiany pozycji, ' +
            'prawidłowa sylwetka podczas chodu oraz prędkość chodu.',
        images: [SitImg, WalkImg]
    },
    {
        number: 2,
        name: 'Five Times Sit to Stand',
        abbreviation: 'FTST',
        info: 'Proszę usiąść na krześle. W wybranym momencie proszę uruchomić rejestrację sygnału. ' +
            'Następnie proszę wstać z krzesła, starając się nie używać pomocy rąk podczas wstawania. ' +
            'Po całkowitym wyprostowaniu, proszę usiąść na krześle. Ćwiczenie powtórzyć 5 razy. ' +
            'Następnie proszę zakończyć rejestrację sygnału. ' +
            'W zadaniu oceniana jest szybkość zmiany pozycji oraz prawidłowa postawa ciała.',
        images: [UpImg, DownImg]
    }
];

const ExerciseScheme = [Exercises[0], Exercises[1]];


export default class ExaminationScreen extends React.Component {

    static navigationOptions = {
        title: 'Badanie'
    };

    constructor(props) {
        super(props);
        this.manager = new BleManager();

        this.state = {
            stage: 'no_power',
            device: null,
            exerciseIdx: null,
            begin: null,
            data: []
        };

        this.firestoreExaminations = firebase.firestore().collection('examinations');
    }

    componentWillMount() {
        this.subscription = this.manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                this.blePoweredOn();
            } else {
                this.blePoweredOff();
            }
        }, true);
    }

    componentWillUnmount() {
        this.subscription.remove();
        this.manager.destroy();
    }

    render() {
        const {stage, device, exerciseIdx} = this.state;

        if (stage === 'no_power' || stage === 'info') {
            return (<InfoPanel poweredOn={stage === 'info'} onScan={() => this.startScan()}/>);
        } else if (stage === 'scan') {
            return (<DeviceList manager={this.manager} onDeviceSelected={(device) => this.onDeviceSelected(device)}/>);
        } else if (stage === 'exercise_info') {
            const exercise = ExerciseScheme[exerciseIdx];
            return (<ExerciseInfoPanel {...exercise} onStart={() => this.onStartExercise()}/>);
        } else if (stage === 'exercise') {
            const exercise = ExerciseScheme[exerciseIdx];
            return  <Exercise exercise={exercise} manager={this.manager} device={device} onFinish={(accData, gyroData) => this.onFinishExercise(accData, gyroData)}/>;
        } else {
            return <View/>;
        }
    }

    blePoweredOn() {
        this.setState((oldState) => update(oldState, {
            stage: {$set: 'info'}
        }));
    }

    blePoweredOff() {
        this.setState((oldState) => update(oldState, {
            stage: {$set: 'no_power'}
        }));
    }

    startScan() {
        this.setState((oldState) => update(oldState, {
            stage: {$set: 'scan'}
        }));
    }

    onDeviceSelected(device) {
        this.setState((oldState) => update(oldState, {
            stage: {$set: 'exercise_info'},
            device: {$set: device},
            exerciseIdx: {$set: 0},
            begin: {$set: new Date()}
        }));
    }

    onStartExercise() {
        this.setState((oldState) => update(oldState, {
            stage: {$set: 'exercise'},
        }));
    }

    onFinishExercise(accData, gyroData) {
        const {exerciseIdx} = this.state;
        const nextExerciseIdx = exerciseIdx + 1;
        const newData = {exerciseIdx: exerciseIdx, accData: accData, gyroData: gyroData};

        if (nextExerciseIdx < ExerciseScheme.length) {
            this.setState((oldState) => update(oldState, {
                stage: {$set: 'exercise_info'},
                exerciseIdx: {$set: nextExerciseIdx},
                data: {$push: [newData]}
            }));
        } else {
            this.storeExamination(newData);
            this.props.navigation.navigate('MainMenu');
        }
    }

    storeExamination(lastData) {
        const {data: prevData, begin} = this.state;

        let data = prevData.slice();
        data.push(lastData);

        const userUID = firebase.auth().currentUser.uid;

        this.firestoreExaminations.add({
            userUID: userUID,
            begin: begin,
            end: new Date(),
            data: data
        }).then((doc) => {
            // TODO: ?
        }).catch((error) => {
            // TODO: ?
        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },

    title: {
        fontSize: 16,
        height: 44,
        justifyContent: "center",
    },

    item: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FF9800',
        padding: 10,
        alignContent: "center",
        color: 'white'
    },
    separator: {
        height: 1,
        width: "72%",
        backgroundColor: "#CED0CE",
        marginLeft: "14%"
    }
});
