import React from 'react';
import ReactDOM from 'react-dom';

import {UIRouter, UIView} from 'ui-router-react';

import router from './commons/utils/routes';

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