import React from 'react';
import ReactDOM from 'react-dom';

import Signup from '../../containers/SignupPage';
import Login from '../../containers/LoginPage';

import {pushStateLocationPlugin, servicesPlugin, UIRouterReact} from '@uirouter/react';

const singUpState = {
  name: 'signup',
  url: '/signup',
  component: Signup
}

const loginState = {
  name: 'login',
  url: '/login',
  component: Login
}

export const appStates = [
  // Definde all the routes here
  singUpState,
  loginState
];

export const plugins = [
    servicesPlugin,
    pushStateLocationPlugin
];
