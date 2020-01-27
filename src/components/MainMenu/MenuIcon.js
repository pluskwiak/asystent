import React from 'react';
import {TouchableOpacity, View, StyleSheet, Text, Image} from 'react-native';


export default MenuIcon = (props) => (<TouchableOpacity style={styles.container} onPress={() => props.onPress()}>
    <View style={styles.background}>
        <Text style={styles.name}>{props.name}</Text>
        <View style={styles.iconContainer}>
            <Image style={styles.image} source={props.img}/>
        </View>
    </View>
</TouchableOpacity>);


const styles = StyleSheet.create({
    container: {
        width: 140,
        height: 140,
        margin: 10,
    },
    background: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f57c00',
        borderRadius: 30
    },
    name: {
        fontSize: 20,
        marginBottom: 4,
        color: '#ffffff'
    },
    iconContainer: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%'
    }
});
