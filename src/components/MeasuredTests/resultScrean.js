import React from 'react';
import {View, StyleSheet, Text, span} from 'react-native';
import TextBannerButton from "../Banner/TextBannerButton";



export default class Statistics extends React.Component {

    static navigationOptions = {
        title: 'Wyniki',
    };

    state = {resultsArray: []}

    constructor(props) {
        super(props);

        const { navigation } = this.props;
        const results = navigation.getParam('results', []);

        this.state={resultsArray: results};
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
    }

    backToMenu ()
    {
        const {navigate} = this.props.navigation;
        navigate('MainMenu');
    }

    

    render() {
        if (this.state.resultsArray.length > 0)
        {
            resultAsText = 'Twoje wyniki: \n';
            
        }
        else
        {
            resultAsText = '';
        }
        return (
        <View style={styles.container}>
            <Text style={styles.infoText}>{'Gratulacje! Ukończyłeś próbę.\n'}
            {resultAsText} 
            {
                this.state.resultsArray.map((element, idx) =>
                        <Text style={styles.infoText}>{'\n'}
                        <Text style={{fontWeight: 'bold'}}>{element.label}</Text>{'\n' + element.text}
                        <Text style={{fontWeight: 'bold'}}>{element.value}</Text>
                        {' sekundy.\n'}</Text>
                       
                )
            }
            
            </Text>
        <View style={styles.bottom}>
            <TextBannerButton text={'Wróć do menu'} onPress={() => this.backToMenu()}/>
        </View>
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        paddingTop: 20
    },
    infoText: {
        width: '90%',
        color: '#212121',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 16,
        marginTop: 16
    },
    bottom: {
        position: 'absolute', 
        width: '100%',
        justifyContent: 'center',
        bottom: 0,
    }
});
