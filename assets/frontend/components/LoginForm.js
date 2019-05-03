import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import { LOGIN } from '../commons/constants/api.constants';
export default class SignupForm extends React.Component {
    constructor(props) {
        // Things to initialize

        super(props);

        this.state = {
            email: '',
            password: '',
            formErrors: {
                email: '',
                password: ''
            }
            // Confirm password is snaked case
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleInputChange(event){
        // Make this a general handler for the values
        // Leverage gotten name for target to change the state
        this.setState({ [event.target.name]: event.target.value });
    }
   
    handleRegister(event){
        // Handles submission of registration
        event.preventDefault();
      
        // Finally make them an attribute for the djangos

        // Reset form errors
        let formErrors = {
            email: '',
            password: ''
        };

        this.state.formErrors = formErrors;

        const params = {
            email: this.state.email,
            password: this.state.password,
            confirm_password: this.state.confirm_password
        }

        // Using axios over the built in fetch. 
        // (Fetch doesn't have interceptions which we will need later)
        axios.post(LOGIN, params)
        .then( response => {
            console.log(response);
            
        })
        .catch( error => {
            // Assign errors to our form error
            // Asssign every error to the formErrors state
            // that way we could display them
            formErrors.email = error.response.data['email'];
            formErrors.password = error.response.data['password'];
            this.setState({formErrors: formErrors});
            return formErrors;
        });
    }

    render() {
    
        const { formErrors } = this.state;

        return (
        <form onSubmit={this.handleRegister}>
        
            <label>
                Email:
                <input type="text"  name="email" value={this.state.email} onChange={this.handleInputChange} />
            </label>

            <label>
                Password:
                <input type="password"  name="password" value={this.state.password} onChange={this.handleInputChange} />
            </label>

            <input type="submit" value="Submit" />
        </form>
        );
    }
}
