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
import { 
  toggleNotifications,
  toggleShowNotification,
  sendFile,
} from './actions/chat';
import styles from './App.css';

const root = document.documentElement;

class App extends Component {

  constructor(props) {
    super(props);
    this.handleDrop = this.handleDrop.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.dragLeave = this.dragLeave.bind(this);
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

  dragOver(e) {
    if (this.props.stage !== CONNECTED) return;
    e.preventDefault();
    root.classList.add(styles.dragOver);
  }

  dragLeave(e) {
    if (this.props.stage !== CONNECTED) return;
    root.classList.remove(styles.dragOver);
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

    Array.from(files).forEach(file => this.props.sendFile(file));
    root.classList.remove(styles.dragOver);
  }


  render() {
    // Have to preventDefault onDragOver for onDrop to work
    return (
      <div 
        onDrop={this.handleDrop} 
        onDragOver={this.dragOver}
        onDragLeave={this.dragLeave}
      >
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
    sendFile: _ => dispatch(sendFile(_)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
