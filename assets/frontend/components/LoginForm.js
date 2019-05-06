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
                password: '',
                non_field_errors: ''
            }
        };
        console.log(this.props);
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
        axios.post(LOGIN, params)
        .then( response => {
            console.log(response);
            
        })
        .catch( error => {
            // Assign errors to our form error
            // Asssign every error to the formErrors state
            // that way we could display them
            // console.log(error.response.data['non_field_errors'][0]);

            formErrors.email = this.getFirstElementOrEmptyString(error.response.data, "email");
            formErrors.password = this.getFirstElementOrEmptyString(error.response.data, "password");
            formErrors.non_field_errors = this.getFirstElementOrEmptyString(error.response.data, "non_field_errors");

            this.setState({formErrors: formErrors});
            // console.log()
            return formErrors;
        });
    }
    
    getFirstElementOrEmptyString(data, key){
        // Gets the element that or return an empty string
        try{
            return data[key][0]
        }catch(err){
            console.log(err);
            return "";
        }
    }

    render() {
    
        const { formErrors } = this.state;

        return (
            <form onSubmit={this.handleRegister}>

                {formErrors.non_field_errors.length > 0 && (
                    <span>{formErrors.non_field_errors}</span>
                )}

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
                </label>

                {formErrors.password.length > 0 && (
                    <span>{formErrors.password}</span>
                )}

                <input type="submit" value="Submit" />
            </form>
        );
    }
}
