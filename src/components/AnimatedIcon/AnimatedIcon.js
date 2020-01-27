import React, {Component} from 'react'
import {Image} from 'react-native'

export default class AnimatedIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {idx: 0};
    }

    componentDidMount() {
        this.timer = setInterval(() => (
            this.setState(previousState => (
                {idx: (previousState.idx + 1) % this.props.images.length}
            ))
        ), 1000);
    }

    componentWillUnmount(){
        clearInterval(this.timer);
        this.timer = null;
    }

    render() {
        return (<Image source={this.props.images[this.state.idx]}/>);
    }

}
