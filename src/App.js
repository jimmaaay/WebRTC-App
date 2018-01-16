import React, { Component } from 'react';
import {
  Route,
  Link,
  withRouter,
} from 'react-router-dom';
import { CONNECTED } from './constants';
import { connect } from 'react-redux';
import BaseRoute from './routes/BaseRoute';
import Create from './routes/Create';
import Join from './routes/Join';
import Connected from './routes/Connected';
import './App.css';


class App extends Component {

  componentDidMount() {
    const { stage, history } = this.props;
    if (stage === CONNECTED) {
      history.push('/connected');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { history, stage:oldStage } = this.props;
    const { stage } = nextProps;
    if (stage === CONNECTED && stage !== oldStage) {
      history.push('/connected');
    }
  }

  render() {
    return (
      <div>
        <header className="header">
          <h1 className="header__title">
            <Link to="/">WebRTC Chat App</Link>
          </h1>
        </header>
        <main>
          <Route exact path="/" component={BaseRoute} />
          <Route exact path="/create" component={Create}/>
          <Route exact path="/join" component={Join} />
          <Route exact path="/connected" component={Connected} />
        </main>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    stage: state.connection.stage,
  };
};

export default withRouter(connect(mapStateToProps)(App));
