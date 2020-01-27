import React from 'react';

import {Text, View, StyleSheet} from 'react-native';

import TextBannerButton from "../Banner/TextBannerButton";
import RunBLEBanner from './RunBLEBanner';

const InfoText = "Włączyć czujnik ruchu. Umieścić czujnik na klatce piersiowej za pomocą pasków. " +
    "Upewnić się, że w telefonie włączone są usługi Bluetooth oraz Lokalizacja. " +
    "W trakcie wykonywania ćwiczenia, telefon powinien pozostać na stole w zasięgu ręki " +
    "lub powinien być obsługiwany przez asystenta. " +
    "Na ekranie będą wyświetlane polecenia dotyczące wykonania ćwiczeń.";


export default InfoPanel = (props) => (<View style={styles.container}>
    <Text style={styles.text}>{InfoText}</Text>
    {!props.poweredOn && <RunBLEBanner/>}
    {props.poweredOn && <TextBannerButton text="Rozpocznij skanowanie" onPress={() => props.onScan()}/>}
</View>);

const styles = StyleSheet.create({
    text: {
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
