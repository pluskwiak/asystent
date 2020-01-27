import React from 'react';
import {FlatList, StyleSheet, ToastAndroid, View} from 'react-native';

import TextBanner from '../Banner/TextBanner';
import DeviceButton from "./DeviceButton";
import update from "immutability-helper";

export default class DeviceList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            devices: []
        }
    }

    componentDidMount() {
        const {manager} = this.props;

        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                this.handleBleError(error);
            } else {
                this.handleDeviceScanned(device);
            }
        });

        this.setState((oldState) => update(oldState, {
            devices: {$set: []}
        }));
    }

    componentWillUnmount() {
        const {manager} = this.props;

        manager.stopDeviceScan();
    }

    render() {
        const {devices} = this.state;
        return (<View style={styles.container}>
            <TextBanner text={"Skanowanie urządzeń... (" + devices.length + ")"}/>
            <FlatList
                data={devices}
                renderItem={({item}) => (<DeviceButton device={item} onPress={() => this.handleDevicePressed(item)}/>)}
                keyExtractor={(item) => item.id}
            />
        </View>);
    }

    handleDeviceScanned(device) {
        const {devices} = this.state;
        if (devices.findIndex((dev) => dev.id === device.id) !== -1) {
            return;
        }
        this.setState((oldState) => update(oldState, {
            devices: {$push: [device]}
        }));
    }

    handleBleError(error) {
        ToastAndroid.show('BLE Error: ' + error.message, ToastAndroid.SHORT);
    }

    handleDevicePressed(device) {
        this.props.onDeviceSelected(device);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
    }
});
