import React from 'react';

import {Text, View, StyleSheet} from 'react-native';

import TextBannerButton from "../Banner/TextBannerButton";

export default ExerciseInfoPanel = (props) => (<View style={styles.container}>
    <Text style={styles.nameText}>{props.name + " (" + props.abbreviation + ")"}</Text>
    <Text style={styles.infoText}>{props.info}</Text>
    <TextBannerButton text="Rozpocznij" onPress={() => props.onStart()}/>
</View>);

const styles = StyleSheet.create({
    nameText: {
        width: '90%',
        color: '#212121',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 16,
        marginTop: 16
    },
    infoText: {
        width: '90%',
        color: '#212121',
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 16,
        marginTop: 16
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
