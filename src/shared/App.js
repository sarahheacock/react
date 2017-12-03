import React from 'react';
import {
  Redirect,
  Route,
  Switch,
  Link
} from 'react-router-dom';


import About from './About';
import Home from './Home';


class App extends React.Component {
  render() {
    return(
      <div>
        <span>Client Side Links: </span><Link to="/">Home</Link> <Link to="/about">About</Link>
        <br />

        <span>Links: </span><a href="/">Home</a> <a href="/about">About</a>
        <br />
        <br />

        Your Isomorphic React Node app is set up!!
        <Switch>
          <Route path="/" exact render={() => (<Home data={this.props.data.name} />)} />
          <Route path="/about" render={() => (<About data={this.props.data.name} />)} />
          <Route render={() => (<Redirect to="/" />)} />
        </Switch>
      </div>
    );
  }
}


export default App;
