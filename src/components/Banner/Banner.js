import React from 'react';
import {View, StyleSheet} from "react-native";

export default Banner = (props) => {
    return (<View style={styles.container}>
        <View style={StyleSheet.flatten([styles.panel, props.style])}>
            {props.children}
        </View>
    </View>);
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 4
    },
    panel: {
        width: '90%',
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f57c00',
        borderRadius: 10
    }
});