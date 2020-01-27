import React from 'react';

import {Modal, Text, View, StyleSheet} from 'react-native';

import TextBanner from '../Banner/TextBanner';
import TextBannerButton from '../Banner/TextBannerButton';

export default InfoModal = (props) => (<Modal
    transparent={true}
    visible={props.visible}
    onRequestClose={() => props.onClose()}
>
    <View style={{
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'}}>
        <View style={{
            width: '80%',
            height: '60%',
            backgroundColor: 'white',
            justifyContent: 'space-between'}}>
            <TextBanner text="Tytuł"/>
            <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <TextBannerButton text={"START"} onPress={() => props.onClose()}/>
        </View>
    </View>
</Modal>);

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        color: '#ffffff'
    }
});
