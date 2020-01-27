import React from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';


export default StatValue = (props) => (<View style={styles.container}>
    <Text style={styles.name}>{props.name}</Text>
    <View style={styles.valueContainer}>
        {props.value !== null ? (<Text style={styles.value}>{String(props.value)}</Text>) : (<ActivityIndicator color="#ffffff" size="large"/>)}
    </View>
</View>);


const styles = StyleSheet.create({
    container: {
        width: 140,
        height: 140,
        padding: 16,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff9800',
        borderRadius: 30
    },
    name: {
        fontSize: 16,
        color: '#ffffff'
    },
    valueContainer: {
        width: 100,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        fontSize: 56,
        color: '#ffffff'
    }
});
