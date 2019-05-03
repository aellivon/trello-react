import React from 'react';
import ReactDOM from 'react-dom';

import {UIRouter, UIView, UISref, UISrefActive, pushStateLocationPlugin} from 'ui-router-react';

import router from './commons/utils/routes';
import Signup from './containers/SignupPage';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <UIRouter router={router}>
        <div>
          {/* Ui view renders the template that a route is defined */}
          <UIView/>
        </div>
      </UIRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-app'));