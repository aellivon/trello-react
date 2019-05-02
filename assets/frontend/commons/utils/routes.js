import React from 'react';
import ReactDOM from 'react-dom';

import Signup from '../../containers/SignupPage';

const singUpState = {
  name: 'signup',
  url: '/signup',
  component: Signup
}

export default [
  // Definde all the routes here
  singUpState
]