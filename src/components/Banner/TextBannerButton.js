import React from 'react';
import {Text, StyleSheet} from "react-native";

import BannerButton from './BannerButton';

export default TextBannerButton = (props) => {
    return (<BannerButton {...props}>
        <Text style={styles.text}>{props.text}</Text>
    </BannerButton>);
};

const styles = StyleSheet.create({
    text: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
