import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom';

import {UIRouter, UIView} from '@uirouter/react';
import {appStates, plugins} from './commons/utils/routes';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <UIRouter plugins={plugins} states={appStates}>
        <div>
          {/* Ui view renders the template that a route is defined */}
          <UIView/>
        </div>
      </UIRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-app'));