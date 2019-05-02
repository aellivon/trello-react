import React from 'react';
import ReactDOM from 'react-dom';

import Signup from '../containers/SignupPage';

export const helloState = {
  name: 'hello',
  url: '/hello',
  component: () => <h3>hello world</h3>
}

export const aboutState = {
  name: 'about',
  url: '/about',
  component: () => <h3>Its the UI-Router hello world app!</h3>
}

export const singUpState = {
  name: 'signup',
  url: '/signup',
  component: Signup
}