import React, { Component } from 'react';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import { CONNECTED } from './constants';
import { connect } from 'react-redux';
import Header from './layout/Header/Header';
import BaseRoute from './routes/BaseRoute';
import Create from './routes/Create';
import Join from './routes/Join';
import Connected from './routes/Connected';
import { emulateConnection } from './actions/connection';
import { toggleNotifications, toggleShowNotification } from './actions/chat';

class App extends Component {

  constructor(props) {
    super(props);
    this.handleDrop = this.handleDrop.bind(this);
    this.preventDefault = this.preventDefault.bind(this);
  }

  componentDidMount() {
    const {
      stage,
      history,
      emulateConnection,
    } = this.props;

    if (document.location.search.indexOf('?emulateConnection') === 0) {
      emulateConnection(true);
      return history.push('/connected');
    }

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

  handleDrop(e) {
    if (this.props.stage !== CONNECTED) return;
    e.preventDefault();
    const { dataTransfer } = e;
    const { files } = dataTransfer;
    console.log(files);
  }

  preventDefault(e) {
    if (this.props.stage !== CONNECTED) return;
    e.preventDefault();
  }

  render() {
    // Have to preventDefault onDragOver for onDrop to work
    return (
      <div onDrop={this.handleDrop} onDragOver={this.preventDefault}>
        <Header />
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
    sendNotifications: state.chat.sendNotifications,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleNotifications: _ => dispatch(toggleNotifications(_)),
    toggleShowNotification: _ => dispatch(toggleShowNotification(_)),
    emulateConnection: _ => dispatch(emulateConnection(_)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
