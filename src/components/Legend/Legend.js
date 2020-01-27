import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export default Legend = (props) => {
    return <View>
        <View style={styles.rowContainer}>
            <View style={styles.dotExamination}/>
            <Text>Trening wykonany</Text>
        </View>
        <View style={styles.rowContainer}>
            <View style={styles.dotSchedule}/>
            <Text>Trening zaplanowany</Text>
        </View>
    </View>
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'center'
    },
    dotExamination: {
        backgroundColor: '#ff9800',
        height: 40,
        width: 40,
        borderRadius: 20,
        margin: 10
    },
    dotSchedule: {
        backgroundColor: '#cddc39',
        height: 40,
        width: 40,
        borderRadius: 20,
        margin: 10
    },

});