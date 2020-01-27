import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CheckBox} from 'react-native-elements';

import firebase from "react-native-firebase";

import update from "immutability-helper";

import TextBanner from '../Banner/TextBanner'
import GreetingButton from '../GreetingScreen/GreetingButton';

import SendImg from './sent.png';

export default class SurveyScreen extends React.PureComponent {

    static navigationOptions = {
        title: 'Ankieta',
    };

    constructor(props) {
        super(props);

        this.state = {
            questions:[
                {name: 'Drżenie', checked: false},
                {name: 'Nagłe stany "off"', checked: false},
                {name: 'Dyskinezy', checked: false},
                {name: 'Bezsenność', checked: false},
                {name: 'Utrata równowagi', checked: false}
            ]
        };

        this.firestoreSurveys = firebase.firestore().collection('surveys');
    }

    render() {

        return (
            <View style={styles.container}>
                <TextBanner text={'Proszę zaznaczyć objawy, które wystąpiły w ciągu ostatniej doby'}/>

                {
                    this.state.questions.map((question, idx) =>
                        <CheckBox
                            key={idx}
                            onPress={() => this.onClick(idx)}
                            title={question.name}
                            checked={question.checked}
                        />)
                }

                <GreetingButton text="Wyślij" img={SendImg} onPress={() => this.sendMessage()}/>
            </View>)
    }

    sendMessage() {
        const userUID = firebase.auth().currentUser.uid;

        this.firestoreSurveys.add({
            date: new Date(),
            userUID: userUID,
            questions: this.state
        }).then((doc) => {
            // TODO: ?
        }).catch((error) => {
            // TODO: ?
        }).finally(() => {
            this.props.navigation.navigate('MainMenu');
        });
    }

    onClick(idx) {
        this.setState((oldState) => update(oldState, {
            questions: {
                [idx]: {
                    checked: {$apply: (oldValue) => !oldValue}
                }
            }
        }));
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});
