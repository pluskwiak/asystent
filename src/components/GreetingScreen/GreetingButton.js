import React from 'react';
import {Text, StyleSheet, Image} from 'react-native';
import BannerButton from "../Banner/BannerButton";

export default GreetingButton = (props) => (
    <BannerButton onPress={() => props.onPress()}>
        <Text style={styles.text}>{props.text}</Text>
        <Image style={styles.image} source={props.img}/>
    </BannerButton>
);

const styles = StyleSheet.create({
    text: {
        color: '#ffffff',
        fontSize: 20,
        marginRight: 16
    },
    image: {
        width: 24,
        height: 24
    }
});
