import React from 'react';
import {Text,View, StyleSheet} from "react-native";
import AnimatedIcon from "../AnimatedIcon/AnimatedIcon";


export default TapedIndicator = (props) => {

    return (<View style={{
                
               
                 flex: 1
              }}>
            <Text style={styles.infoText}>{props.text}</Text>
            <AnimatedIcon style={styles.animatedIcon} images={props.images}/>
            </View>
            );
            
};

const styles = StyleSheet.create({
    infoText: {
        width: '90%',
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