import React from 'react';
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';

import About from './About';
import Home from './Home';
//import "./App.css";

const App = (props) => {
  return (
    <div>
      Your React Node app is set up!
      <Switch>
        <Route path="/" exact render={() => (<Home data={props.data.name} />)} />
        <Route path="/about" render={() => (<About data={props.data.name} />)} />
        <Route render={() => (<Redirect to="/" />)} />
      </Switch>
    </div>
  );
}

export default App;
// export default withStyles(s)(App);
