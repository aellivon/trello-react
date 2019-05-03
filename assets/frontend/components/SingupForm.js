import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import { SIGNUP } from '../commons/constants/api.constants';
export default class SignupForm extends React.Component {
    constructor(props) {
        // Things to initialize

        super(props);

        this.state = {
            email: '',
            password: '',
            // Confirm password is snaked case
            confirm_password: '',
            formErrors:{
                email: '',
                password: '',
                confirm_password: '',
                non_field_errors: ''
            }
      
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
            password: '',
            confirm_password: '',
            non_field_errors: ''
        };

        this.state.formErrors = formErrors;

        const params = {
            email: this.state.email,
            password: this.state.password,
            confirm_password: this.state.confirm_password
        }


        // Using axios over the built in fetch. 
        // (Fetch doesn't have interceptions which we will need later)
        axios.post(SIGNUP, params)
        .then( response => {
            console.log(response);
            return response;
        })
        .catch( error => {
            // Assign errors to our form error
            // Asssign every error to the formErrors state
            // that way we could display them
            formErrors.email = error.response.data['email'],
            formErrors.password = error.response.data['password'],
            formErrors.confirm_password = error.response.data['confirm_password'],
            formErrors.non_field_errors = error.response.data['non_field_errors']
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
            {formErrors.email.length > 0 && (
                <span>{formErrors.email}</span>
            )}
            <label>
                Password:
                <input type="password"  name="password" value={this.state.password} onChange={this.handleInputChange} />
                {formErrors.password.length > 0 && (
                    <span>{formErrors.password}</span>
                )}
            </label>

            <label>
                Confirm Password:
                <input type="password"  name="confirm_password" value={this.state.confirm_password} onChange={this.handleInputChange} />
                {formErrors.confirm_password.length > 0 && (
                    <span>{formErrors.confirm_password}</span>
                )}
            </label>

            <input type="submit" value="Submit" />
        </form>
        );
    }
}
