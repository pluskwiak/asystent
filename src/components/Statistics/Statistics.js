import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import update from 'immutability-helper';

import firebase from 'react-native-firebase';

import StatValue from './StatValue';


export default class Statistics extends React.Component {

    static navigationOptions = {
        title: 'Statystyki',
    };

    constructor(props) {
        super(props);

        this.state = {
            examinationCount: null,
            exerciseCount: null,
            surveysCount: null,
            stat4: "?",
            stat5: "?",
            stat6: "?"
        };
    }

    componentDidMount() {
        const userUID = firebase.auth().currentUser.uid;
        const examinations = firebase.firestore().collection('examinations');
        const surveys = firebase.firestore().collection('surveys');

        examinations.where('userUID', '=', userUID).get()
            .then((snapshot) => {
                const examinationCount = snapshot.docs.length;
                const exerciseCount = snapshot.docs
                    .map((docRef) => docRef.data())
                    .filter((doc) => doc.hasOwnProperty('data'))
                    .reduce((acc, doc) => acc + doc.data.length, 0);
                this.setState((oldState) => update(oldState, {
                    examinationCount: {$set: examinationCount},
                    exerciseCount: {$set: exerciseCount}
                }));
            })
            .catch((error) => {
                // TODO: Toast?
            });

        surveys.where('userUID', '=', userUID).get()
            .then((snapshot) => {
                const surveysCount = snapshot.docs.length;
                this.setState((oldState) => update(oldState, {
                    surveysCount: {$set: surveysCount}
                }));
            })
            .catch((error) => {
                // TODO: Toast?
            });
    }

    componentWillUnmount() {
    }

    render() {
        const { examinationCount, exerciseCount, surveysCount } = this.state;
        return (<View style={styles.container}>
            {/*<Text>{"" + typeof(examinationCount) + " " + typeof(exerciseCount)}</Text>*/}
            <StatValue name={"Badania"} value={examinationCount}/>
            <StatValue name={"Ćwiczenia"} value={exerciseCount}/>
            <StatValue name={"Ankiety"} value={surveysCount}/>
            {/*<StatValue name={"Stat 4"} value={stat4}/>*/}
            {/*<StatValue name={"Stat 5"} value={stat5}/>*/}
            {/*<StatValue name={"Stat 6"} value={stat6}/>*/}
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center'
    }
});
