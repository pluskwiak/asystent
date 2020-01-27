import React, {Component} from 'react';
import {ImageBackground, StyleSheet, Text, Button, View} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";

import MainMenu from './src/components/MainMenu/MainMenu';
import Scan from './src/components/ListDevices/DeviceList';
import Calendar from './src/components/Calendar/Calendar';
import Statistics from './src/components/Statistics/Statistics';
import Examination from './src/components/Examination/Examination';
import SurveyScreen from './src/components/SurveyScreen/SurveyScreen';

import LoginScreen from './src/components/Login/Login';
import SignUpScreen from './src/components/Login/SignUp';
import GreetingScreen from './src/components/GreetingScreen/GreetingScreen'
import Setting from './src/components/Settings/Setting'
import Trial from './src/components/MeasuredTests/Trial'
import TrialResult from './src/components/MeasuredTests/resultScrean'
// TODO: Remove global context
import {GlobalContextProvider} from "./GlobalContext";

const AppNavigator = createStackNavigator(
    {
        MainMenu: MainMenu,
        Scan: Scan,
        Calendar: Calendar,
        Statistics: Statistics,
        Examination: Examination,
        SurveyScreen: SurveyScreen,
        Trial: Trial,
        TrialResult: TrialResult,
        Setting: Setting,
        SignUp: SignUpScreen,
        Login: LoginScreen,
        GreetingScreen: GreetingScreen
    },
    {
        initialRouteName: 'GreetingScreen'
    }
);



const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {

    render() {
        return (
            <GlobalContextProvider>
                <AppContainer/>
            </GlobalContextProvider>
        );
    }

}
