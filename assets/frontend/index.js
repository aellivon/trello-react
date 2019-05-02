import React from 'react';
import ReactDOM from 'react-dom';

import {UIRouter, UIView, UISref, UISrefActive, pushStateLocationPlugin} from 'ui-router-react';

import * as Route from './routes/api.routes';

class App extends React.Component {
  render () {
    return (

      <UIRouter plugins={[pushStateLocationPlugin]} states={[Route.helloState, Route.aboutState]}>
        <div>
          <UISrefActive class="active">
            <UISref to="hello"><button>Hello</button></UISref>
          </UISrefActive>
          <UISrefActive class="active">
            <UISref to="about"><button>About</button></UISref>
          </UISrefActive>

          <UIView/>
        </div>
      </UIRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-app'));