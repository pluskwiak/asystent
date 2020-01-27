import React from 'react';
import {Text, StyleSheet} from "react-native";

import Banner from './Banner';

export default TextBanner = (props) => {
    return (<Banner {...props}>
        <Text style={styles.text}>{props.text}</Text>
    </Banner>);
};

const styles = StyleSheet.create({
    text: {
        color: '#ffffff',
        fontSize: 16
    }
});