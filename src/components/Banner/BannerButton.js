import React from 'react';
import {TouchableOpacity, StyleSheet} from "react-native";

import Banner from './Banner';

export default BannerButton = (props) => {
    return (<TouchableOpacity style={styles.container} onPress={() => props.onPress()}>
        <Banner>
            {props.children}
        </Banner>
    </TouchableOpacity>);
};

const styles = StyleSheet.create({
    container: {
        width: '100%'
    }
});