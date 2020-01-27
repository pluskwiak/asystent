import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

import update from 'immutability-helper';

import firebase from 'react-native-firebase'

import AuthPrompt from './AuthPrompt';


export default class LoginScreen extends React.Component {

    static navigationOptions = {header: null};

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: null,
            busy: false
        };
    }

    render() {
        const {email, password, error, busy} = this.state;
        return (
            <View style={styles.container}>
                {!busy && <AuthPrompt
                    email={email}
                    setEmail={(email) => this.onEmailChanged(email)}
                    password={password}
                    setPassword={(password) => this.onPasswordChanged(password)}
                    error={error}
                    onSubmit={() => this.handleLogin()}
                    buttonText="Zaloguj się"
                />}
                {busy && <ActivityIndicator color="#ff9800" size={80}/>}
            </View>
        )
    }

    onEmailChanged(email) {
        this.setState((oldState) => update(oldState, {
            email: { $set: email }
        }));
    }

    onPasswordChanged(password) {
        this.setState((oldState) => update(oldState, {
            password: { $set: password }
        }));
    }

    handleLogin = () => {
        const {email, password} = this.state;
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => this.handleSuccess())
            .catch(error => this.handleError(error));

        this.setState((oldState => update(oldState, {
            busy: { $set: true }
        })));
    };

    handleSuccess() {
        this.props.navigation.navigate('GreetingScreen');
        this.setState((oldState => update(oldState, {
            busy: { $set: false }
        })));
    }

    handleError(error) {
        this.setState((oldState => update(oldState, {
            error: { $set: error },
            busy: { $set: false }
        })));
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
});
