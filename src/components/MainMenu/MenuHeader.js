import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import CareImg from './care.png';

import FlatBackground from "../Banner/FlatBackground";

export default MenuHeader = (props) => (
    <FlatBackground>
        <View style={styles.container}>
            <Image style={styles.image} source={CareImg}/>
            <Text style={styles.text}>Asystent pacjenta</Text>
        </View>
    </FlatBackground>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 32
    },
    text: {
        color: '#ffffff',
        fontSize: 24
    },
    image: {
        width: 48,
        height: 48,
        marginRight: 24
    }
});
