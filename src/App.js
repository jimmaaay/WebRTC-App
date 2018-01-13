import React, { Component, Fragment } from 'react';
import RoomButtons from './RoomButtons';
import Create from './rooms/Create';
import Join from './rooms/Join';
import './App.css';

const rooms = {
  create: Create,
  join: Join,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: false,
    };

    this.pickedRoomType = this.pickedRoomType.bind(this);
  }

  pickedRoomType(roomType) {
    this.setState({
      ...this.state,
      room: roomType,
    });
  }

  render() {
    const content = this.state.room === false 
    ? <RoomButtons onRoom={this.pickedRoomType} />
    : (() => {
      const Room = rooms[this.state.room];
      return <Room/>
    })();

    return (
      <Fragment>
        <header className="header">
          <h1 className="header__title">Welcome to React</h1>
        </header>
        <main>
          { content }
        </main>
      </Fragment>
    );
  }
}

export default App;
