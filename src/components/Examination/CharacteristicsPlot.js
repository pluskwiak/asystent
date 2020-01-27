import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import { LineChart, Grid } from 'react-native-svg-charts'
import * as shape from 'd3-shape';

export default CharacteristicsPlot = (props) => (
    <View style={styles.container}>
            <Text style={styles.label}>{props.name}</Text>
            <LineChart
                style={{flex: 1}}
                contentInset={{top: 30, bottom: 30}}
                svg={{stroke: '#1565C0'}}
                data={props.samples.map((sample) => sample.x)}
                curve={ shape.curveNatural }
                yMin={props.min}
                yMax={props.max}
            />
            <LineChart
                style={StyleSheet.absoluteFill}
                contentInset={{top: 30, bottom: 30}}
                svg={{stroke: '#2196F3'}}
                data={props.samples.map((sample) => sample.y)}
                curve={ shape.curveNatural }
                yMin={props.min}
                yMax={props.max}
            />
            <LineChart
                style={StyleSheet.absoluteFill}
                contentInset={{top: 30, bottom: 30}}
                svg={{stroke: '#90CAF9'}}
                data={props.samples.map((sample) => sample.z)}
                curve={ shape.curveNatural }
                yMin={props.min}
                yMax={props.max}
            />
    </View>
);

const styles = StyleSheet.create({
        container: {
                height: 100
        },
        label: {
                position: 'absolute',
                color: '#757575',
                top: 40,
                left: 10,
                fontSize: 12,
                fontWeight: 'bold'
        }
});
