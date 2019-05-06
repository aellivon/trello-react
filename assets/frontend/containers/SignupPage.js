import React from 'react';
import ReactDOM from 'react-dom';

import SignupForm from '../components/SingupForm';

export default class Signup extends React.Component {
    constructor(props) {
        // Things to initialize
        console.log(props);
        super(props);
    }
    render () {
        return (
            // Pass the props from the parent to the child
            <SignupForm {...this.props}/>
        )
    }
}