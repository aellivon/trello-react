import React from 'react';
import ReactDOM from 'react-dom';

import Signup from '../../containers/SignupPage';
import Login from '../../containers/LoginPage';

import {pushStateLocationPlugin, servicesPlugin, UIRouterReact} from 'ui-router-react';

const singUpState = {
  name: 'signup',
  url: '/signup',
  component: Signup,
  resolve: [{
    token: 'router',
    deps: ['$transition$'],
    resolveFn: (trans) => trans.router
  }]
}

const loginState = {
  name: 'login',
  url: '/login',
  component: Login,
  resolve: [{
    token: 'router',
    deps: ['$transition$'],
    resolveFn: (trans) => trans.router
  }]
}

const appStates = [
  // Definde all the routes here
  singUpState,
  loginState
];

// Create a new instance of the Router
const router = new UIRouterReact();
router.plugin(servicesPlugin);
router.plugin(pushStateLocationPlugin);

// Register the initial (eagerly loaded) states 
appStates.forEach(state => router.stateRegistry.register(state));

// Global config for router
router.urlService.rules.initial({ state: 'home' });

router.start();

export default router;