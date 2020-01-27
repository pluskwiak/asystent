import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import firebase from "react-native-firebase";

import play from './play-button.png';
import sign from './log-in.png';
import cross from './cross.png';
import lock from './lock.png';

import GreetingHeader from "./GreetingHeader";
import GreetingButton from "./GreetingButton";
import TextBanner from "../Banner/TextBanner";

export default class Loading extends React.Component {
    static navigationOptions = {header: null};

    constructor(props) {
        super(props);
        this.unsubscriber = null;
        this.state = {
            user: null,
        };
    }

    componentDidMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            this.setState({user});
            //console.log (user);
        });
       
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    render() {
        const {user} = this.state;

        return (
            <View style={styles.container}>
                <GreetingHeader/>
                <View style={styles.bannerContainer}>
                    {!user && <GreetingButton text="Zaloguj" img={lock} onPress={() => this.LogIn()}/>}
                    {user && <GreetingButton text="Start" img={play} onPress={() => this.GoToMainMenu()}/>}
                    {!user && <GreetingButton text="Zarejestruj się" img={sign} onPress={() => this.SignUp()}/>}
                    {user && <GreetingButton text="Wyloguj" img={cross} delayLongPress={800} onLongPress={() => this.LogOut()}/>}
                    {user && <TouchableOpacity delayLongPress={8800} onLongPress={() => this.SetUp()}><TextBanner text={"Zalogowany jako " + user.email}/></TouchableOpacity>}
                </View>

            </View>)

    }

    LogIn() {
        const {navigate} = this.props.navigation;
        navigate('Login');
    }
    SetUp() {
        const {navigate} = this.props.navigation;
        navigate('Setting', {uid: this.state.user.uid});
    }
    SignUp() {
        const {navigate} = this.props.navigation;
        navigate('SignUp');
    }

    GoToMainMenu() {
        const {navigate} = this.props.navigation;
        navigate('MainMenu');
    }

    LogOut() {
        firebase.auth().signOut().then(()=>{this.setState({user: null})});
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
    bannerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
