import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

import Banner from '../Banner/Banner';

export default RunBLEBanner = () => (
    <Banner>
        <Text style={styles.text}>Oczekiwanie na usługę Bluetooth</Text>
        <ActivityIndicator color="#ffffff" size="large"/>
    </Banner>
);

const styles = StyleSheet.create({
    text: {
        color: '#ffffff',
        fontSize: 16,
        marginRight: 16,
        fontWeight: 'bold'
    }
});