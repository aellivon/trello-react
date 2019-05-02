import React from 'react';
import ReactDOM from 'react-dom';

import {UIRouter, UIView, UISref, UISrefActive, pushStateLocationPlugin} from 'ui-router-react';

import REGISTERED_ROUTES from './commons/utils/routes';
import Signup from './containers/SignupPage';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <UIRouter plugins={[pushStateLocationPlugin]} states={REGISTERED_ROUTES}>
        <div>
          {/* Ui view renders the template that a route is defined */}
          <UIView/>
        </div>
      </UIRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-app'));