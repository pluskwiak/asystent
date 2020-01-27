import React from 'react';

import update from 'immutability-helper';

const GlobalContext = React.createContext({});

export class GlobalContextProvider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null
        };
    }

    render() {
        return (<GlobalContext.Provider value={{ ...this.state, setUser: (user) => this.setUser(user) }}>
            {this.props.children}
        </GlobalContext.Provider>);
    }

    setUser(user) {
        this.setState((oldState) => update(oldState, { user: { $set: user } }));
    }

}

export const withGlobalContext = ChildComponent => props => (
    <GlobalContext.Consumer>
        {
            context => <ChildComponent {...props} global={context} />
        }
    </GlobalContext.Consumer>
);
