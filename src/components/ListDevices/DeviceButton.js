import React from 'react';
import {Text, Image, StyleSheet} from "react-native";

import BannerButton from '../Banner/BannerButton';

import ble_unClick from './bluetooth_click.png'
import ble_click from './bluetooth_unclick.png'

export default DeviceButton = (props) => {
    return (<BannerButton onPress={() => props.onPress()}>
        <Image style={styles.image} source={props.device.pressStatus
                            ? ble_unClick
                            : ble_click}/>
        <Text style={ props.device.pressStatus
                            ? styles.text_cliced
                            : styles.text_uncliced
                    }>{props.device.name + " (" + props.device.id + ")"}</Text>
   
    </BannerButton>);
};

const styles = StyleSheet.create({
    image: {
        width: 40,
        height: 40
    },
    text_cliced: {
        color: '#800000',
        fontSize: 16,
        marginLeft: 16
    },
    
    text_uncliced: {
        color: 'white',
        fontSize: 16,
        marginLeft: 16
    }
});