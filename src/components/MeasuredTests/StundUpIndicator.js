

import React from 'react';
import {Dimensions, Text,View, ImageBackground, StyleSheet} from "react-native";
import AnimatedIcon from "../AnimatedIcon/AnimatedIcon";


import UpImg from './up.png';
import DownImg from './down.png';

export default class TrumpingIndicator extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
           return (<View style={{
                alignItems: 'center',
               
                 flex: 1
              }}>
            <Text style={styles.infoText}>{this.props.text}</Text>
            <AnimatedIcon style={styles.animatedIcon} images={[UpImg, DownImg]}/>
            </View>
            );
    }            
};

const styles = StyleSheet.create({
    infoText: {
        //width: '90%',
        color: '#212121',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 16,
        marginTop: 16
    },
    animatedIcon: {
        height: '90%',
    }
    
});