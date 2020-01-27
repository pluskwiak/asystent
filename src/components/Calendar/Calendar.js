import React from 'react';
import {StyleSheet, View, Text, ToastAndroid} from 'react-native';
import Legend from '../Legend/Legend'
import {CalendarList} from 'react-native-calendars'

import firebase from 'react-native-firebase';

import update from "immutability-helper";

function convertDate(d) {
    const pad = (s) => (s < 10) ? '0' + s : s;
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
}

export default class Calendar extends React.Component {

    static navigationOptions = {
        title: 'Kalendarz ćwiczeń',
    };

    constructor(props) {
        super(props);

        this.state = {
            markedDates: {}
        }
    }

    componentDidMount() {
        this.reloadEvents()
    }

    render() {
        const {markedDates} = this.state;
        return (<View style={styles.container}>
            <CalendarList horizontal={true} pagingEnabled={true} markedDates={markedDates}/>
            <Legend/>
        </View>);
    }

    reloadEvents() {
        const userUID = firebase.auth().currentUser.uid;
        const examinations = firebase.firestore().collection('examinations');
        const plans = firebase.firestore().collection('plans');

        examinations.where('userUID', '=', userUID).get()
            .then((snapshot) => {
                const dates = snapshot.docs
                    .map((docRef) => docRef.data())
                    .filter((doc) => doc.hasOwnProperty('begin') && doc.begin !== null)
                    .map((doc) => convertDate(doc.begin));

                let examinationDates = {};
                for (let i = 0; i < dates.length; ++i) {
                    examinationDates[dates[i]] = {selected: true, selectedColor: '#ff9800'};
                }

                this.setState((oldState) => update(oldState, {
                    markedDates: {$merge: examinationDates}
                }));
            })
            .catch((error) => {
                ToastAndroid.show('Fetch error: ' + error.message, ToastAndroid.SHORT);
            });

        plans.where('userUID', '=', userUID).get()
            .then((snapshot) => {
                const dates = snapshot.docs.map((docRef) => docRef.data())
                    .filter((doc) => Array.isArray(doc.dates))
                    .reduce((acc, doc) => acc.concat(doc.dates), [])
                    .map((date) => convertDate(date));

                let scheduledDates = {};
                for (let i = 0; i < dates.length; ++i) {
                    scheduledDates[dates[i]] = {selected: true, selectedColor: '#cddc39'};
                }

                this.setState((oldState) => update(oldState, {
                    markedDates: {$merge: scheduledDates}
                }));
            })
            .catch((error) => {
                ToastAndroid.show('Fetch error: ' + error.message, ToastAndroid.SHORT);
            })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});
