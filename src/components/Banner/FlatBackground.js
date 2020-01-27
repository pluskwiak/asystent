import React from 'react';
import {View, StyleSheet} from 'react-native';

export default FlatBackground = (props) => {
    return <View style={styles.container}>
        {props.children}
    </View>
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        marginBottom: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff9800'
    },

});