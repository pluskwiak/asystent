import React from "react";
import {StyleSheet, Text, TextInput, View} from "react-native";

import TextBannerButton from "../Banner/TextBannerButton";

export default AuthPrompt = (props) => (<View style={styles.container}>
        {props.error && <Text style={{color: 'red'}}> {props.error.message} </Text>}
        <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={email => props.setEmail(email)}
            value={props.email}
        />
        <TextInput
            secureTextEntry
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Password"
            onChangeText={password => props.setPassword(password)}
            value={props.password}
        />
        <TextBannerButton text={props.buttonText} onPress={() => props.onSubmit()}/>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 4,
        marginBottom: 4
    },
    text: {
        color: 'white',
        fontSize: 20,
        marginRight: 16
    },
});
