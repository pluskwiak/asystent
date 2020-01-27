import React from 'react';
import {View, StyleSheet, ToastAndroid, ScrollView, ActivityIndicator} from 'react-native';

import update from 'immutability-helper';

import TextBannerButton from "../Banner/TextBannerButton";
import ExerciseInfoHeader from "./ExerciseInfoHeader";

import base64 from "base64-js";

import {BleError} from "react-native-ble-plx";

import CharacteristicsPlot from "./CharacteristicsPlot";


const ServiceUUID = "0000bcdf-1212-efde-1523-785fef13d123";


function dimmWrapper(callback, dimmer) {
    let filter = 0;
    return (error, characteristics) => {
        if (error) {
            callback(error, characteristics);
        } else {
            if (filter === 0) {
                callback(error, characteristics);
            }
            filter = (filter + 1) % dimmer;
        }
    };
}

function decodeCharacteristicsValue(value, ratio) {
    const decoded = base64.toByteArray(value);

    // const val0 = decoded[0];
    let val1 = (decoded[1] << 8) | (decoded[2]);
    let val2 = (decoded[3] << 8) | (decoded[4]);
    let val3 = (decoded[5] << 8) | (decoded[6]);

    val1 /= ratio;
    val2 /= ratio;
    val3 /= ratio;

    return {
        x: val1,
        y: val2,
        z: val3
    };
}

export default class Exercise extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            busy: false,
            accelerometer: {
                data: [],
                range: {min: 0, max: 1}
            },
            gyroscope: {
                data: [],
                range: {min: 0, max: 1}
            }
        }
    }

    render() {
        const {exercise} = this.props;
        const {
            busy,
            accelerometer: {data: aData, range: {min: aMin, max: aMax}},
            gyroscope: {data: gData, range: {min: gMin, max: gMax}}
        } = this.state;

        if (busy) {
            return (<View style={styles.container}>
                <ActivityIndicator color="#ff9800" size={80}/>
            </View>);
        }

        return (<View style={styles.container}>
            <ExerciseInfoHeader {...exercise} />
            <CharacteristicsPlot name="Akcelerometr" samples={aData.slice(-20)} min={aMin} max={aMax} />
            <CharacteristicsPlot name="Żyroskop" samples={gData.slice(-20)} min={gMin} max={gMax} />
            <TextBannerButton text="Zakończ" onPress={() => this.onFinish(aData, gData)}/>
        </View>);
    }

    componentDidMount() {
        this.discoverServices();
    }

    componentWillUnmount() {

    }

    discoverServices() {
        const { device } = this.props;

        this.setState((oldState) => update(oldState, { busy: { $set: true } }));

        device.connect()
            .then((device) => {
                return device.discoverAllServicesAndCharacteristics();
            })
            .then((device) => {
                return device.services();
            })
            .then((services) => {
                const service = services.find((service) => service.uuid === ServiceUUID);
                if (!service) {
                    throw BleError('Could not find service ' + ServiceUUID);
                }
                return service.characteristics();
            })
            .then((characteristics) => {
                const accelerometerCharacteristic = characteristics.find((c) => c.uuid.startsWith("0000000a"));
                const gyroscopeCharacteristic = characteristics.find((c) => c.uuid.startsWith("0000000b"));
                if (!accelerometerCharacteristic) {
                    throw BleError('Could not find accelerometer characteristic');
                }
                if (!gyroscopeCharacteristic) {
                    throw BleError('Could not find gyroscope characteristic');
                }

                const accelerometerWrapper = dimmWrapper((error, c) => this.handleAccelerometerChange(error, c), 8);
                const gyroscopeWrapper = dimmWrapper((error, c) => this.handleGyroscopeChange(error, c), 8);

                this.accelerometerSubscription = accelerometerCharacteristic.monitor((error, c) => accelerometerWrapper(error, c));
                this.gyroscopeSubscription = gyroscopeCharacteristic.monitor((error, c) => gyroscopeWrapper(error, c));
            })
            .catch((error) => {
                this.handleBleError(error);
            })
            .finally(() => {
                this.setState((oldState) => update(oldState, { busy: { $set: false } }));
            });
    }

    handleAccelerometerChange(error, characteristic) {
        if (error) {
            this.handleBleError(error);
        } else {
            this.handleCharacteristicChange(characteristic.value, "accelerometer", 16384);
        }
    }

    handleGyroscopeChange(error, characteristic) {
        if (error) {
            this.handleBleError(error);
        } else {
            this.handleCharacteristicChange(characteristic.value, "gyroscope", 131);
        }
    }

    handleCharacteristicChange(value, stateKey, ratio) {
        const sample = decodeCharacteristicsValue(value, ratio);
        const sampleMin = Math.min(sample.x, sample.y, sample.z);
        const sampleMax = Math.max(sample.x, sample.y, sample.z);
        this.setState((oldState) => update(oldState, {
            [stateKey]: {
                data: {$push: [sample]},
                range: {
                    min: { $apply: (oldMin) => Math.min(oldMin, sampleMin) },
                    max: { $apply: (oldMax) => Math.max(oldMax, sampleMax) }
                }
            }
        }));
    }

    onFinish(aData, gData) {
        const { device } = this.props;
        this.setState((oldState) => update(oldState, { busy: { $set: true } }));
        if (this.accelerometerSubscription) {
            this.accelerometerSubscription.remove();
            delete this.accelerometerSubscription;
        }
        if (this.gyroscopeSubscription) {
            this.gyroscopeSubscription.remove();
            delete this.gyroscopeSubscription;
        }
        device.cancelConnection()
            .catch((error) => {
                this.handleBleError(error);
            })
            .finally(() => {
                this.setState((oldState) => update(oldState, { busy: { $set: false } }));
                this.props.onFinish(aData, gData);
            });
    }

    handleBleError(error) {
        ToastAndroid.show('BLE Error: ' + error.message, ToastAndroid.SHORT);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-around'
    }
});
