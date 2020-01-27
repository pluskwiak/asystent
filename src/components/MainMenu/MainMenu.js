import React from 'react';
import {View, StyleSheet} from 'react-native';

import CalendarImg from './calendar.png';
import ActivityImg from './man-ready-to-jump.png';
import TestImg from './survey.png';
import GraphImg from './analytics.png';
import MeasureImg from './iconTest.png';

import MenuHeader from './MenuHeader';
import MenuIcon from "./MenuIcon";


export default class MainMenu extends React.Component {
 constructor(props) {
        super(props);
        console.disableYellowBox = true;

 }
    static navigationOptions = {
        title: 'Asystent domowej rehabilitacji',
        header: null
    };

    render() {
        return (<View style={styles.container}>
            <MenuHeader/>
            <View style={styles.iconContainer}>
                <MenuIcon onPress={() => this.onCalendar()} name="Kalendarz" img={CalendarImg}/>
                <MenuIcon onPress={() => this.onExamination()} name="Ćwiczenie" img={ActivityImg}/>
                <MenuIcon onPress={() => this.onSurvey()} name="Ankieta" img={TestImg}/>
                <MenuIcon onPress={() => this.onStatistics()} name="Statystyki" img={GraphImg}/>
                <MenuIcon onPress={() => this.onTests()} name="Próba" img={MeasureImg}/>
            </View>
        </View>);
    }

    onTests() {
       const {navigate} = this.props.navigation;
       navigate('Trial');
    };

    onCalendar() {
        const {navigate} = this.props.navigation;
        navigate('Calendar');
    };

    onSurvey() {
        const {navigate} = this.props.navigation;
        navigate('SurveyScreen');
    };

    onExamination() {
       const {navigate} = this.props.navigation;
        navigate('Examination');
    };

    onStatistics() {
        const {navigate} = this.props.navigation;
       navigate('Statistics');
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    iconContainer: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
});