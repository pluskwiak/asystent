import React from 'react';
import {Text, StyleSheet, Image} from 'react-native';

import care from './care.png'

import FlatBackground from "../Banner/FlatBackground";

export default GreetingHeader = (props) => (
    <FlatBackground>
        <Image style={styles.image} source={care}/>
        <Text style={styles.text}>Asystent pacjenta</Text>
    </FlatBackground>
);

const styles = StyleSheet.create({
    text: {
        color: '#ffffff',
        fontSize: 32
    },
    image: {

    }
});
