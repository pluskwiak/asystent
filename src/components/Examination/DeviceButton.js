import React from 'react';
import {Text, Image, StyleSheet} from "react-native";

import BannerButton from '../Banner/BannerButton';

import ble from './bluetooth.png'

export default DeviceButton = (props) => {
    return (<BannerButton onPress={() => props.onPress()}>
        <Image style={styles.image} source={ble}/>
        <Text style={styles.text}>{props.device.name + " (" + props.device.id + ")"}</Text>
    </BannerButton>);
};

const styles = StyleSheet.create({
    image: {
        width: 40,
        height: 40
    },
    text: {
        color: 'white',
        fontSize: 16,
        marginLeft: 16
    }
});