import Svg,{
    Circle,
    Ellipse,
    G,
    TSpan,
    TextPath,
    Path,
    Polygon,
    Polyline,
    Line,
    Rect,
    Use,
    Image,
    Symbol,
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    ClipPath,
    Pattern,
    Mask,
} from 'react-native-svg';

import React from 'react';
import {Dimensions, Text,View, ImageBackground, StyleSheet} from "react-native";
import AnimatedIcon from "../AnimatedIcon/AnimatedIcon";

/*import back from './background.png';
import neadle from './neadle.png';*/
import UpImg from './TrumpUp.png';
import DownImg from './TrumpDown.png';
export default class TrumpingIndicator extends React.Component {

    constructor(props) {
        super(props);
    }
  /*      this.neadleHeight=(0.4366* Dimensions.get('window').width);
   }
  
    neadleStyle ()
    {
        console.log(this.neadleHeight);
        console.log(Dimensions.get('window').width/2)
        console.log(Math.cos(30*Math.PI/180)*397/2)
        return {
            transform: [{ rotate: '60deg' }],
            left: Dimensions.get('window').width/2,
            //left: Math.cos(45*Math.PI/180)*397/2,
            height: this.neadleHeight,

        }
    }
    <ImageBackground resizeMode={'contain'} source={back} style={{width:'100%'}}>
               
                    <Image resizeMode={'contain'} source={neadle} style={this.neadleStyle()}/>
               
            </ImageBackground>
            <View style={{flex: 1}}>
            <Text style={styles.infoText}>{this.props.text}</Text>
            
            <Svg
    height="100%"
    width="100%"
>
    <Circle
        cx="50%"
        cy={this.props.position}
        r="15%"
        fill="pink"
    />
</Svg> </View>*/
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