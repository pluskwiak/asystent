import React from 'react';
import {Text,View, StyleSheet} from "react-native";

import {CheckBox} from 'react-native-elements';


export default SelectedList = (props) => {

    return (<View style={{
                              
                 flex: 1
              }}>
            <Text style={styles.infoText}>{props.text}</Text>
            {
            props.itemsList.map((question, idx) =>
                        <CheckBox
                            key={idx}
                            title={question.id}
                            checkedColor="#f57c00"
                            checked={question.finded}
                        />)
            }
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
    }
});