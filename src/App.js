import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import BaseRoute from './routes/BaseRoute';
import Create from './routes/Create';
import Join from './routes/Join';
import './App.css';


class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <header className="header">
            <h1 className="header__title">Welcome to React</h1>
          </header>
          <main>
            <Route exact path="/" component={BaseRoute} />
            <Route exact path="/create" component={Create}/>
            <Route exact path="/join" component={Join} />
          </main>
        </div>
      </Router>
    );
  }

}

const mapStateToProps = (state) => {
  return {

  }
};

export default connect(mapStateToProps)(App);
