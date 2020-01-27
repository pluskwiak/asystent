import React from 'react';

import {Text, View, StyleSheet} from 'react-native';

import AnimatedIcon from "../AnimatedIcon/AnimatedIcon";
import FlatBackground from "../Banner/FlatBackground";

export default ExerciseInfoHeader = (props) => (<View style={styles.container}>
    <Text style={styles.nameText}>{props.name + " (" + props.abbreviation + ")"}</Text>
    <FlatBackground>
        <AnimatedIcon images={props.images}/>
    </FlatBackground>
</View>);

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch'
    },
    nameText: {
        color: '#212121',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 16,
        marginTop: 16
    },
});
