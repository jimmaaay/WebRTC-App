import React, { Component } from 'react';


class RoomButtons extends Component {

  constructor(props) {
    super(props);
    this.returnValue = this.returnValue.bind(this);
  }

  returnValue(val) {
    return _ => this.props.onRoom(val);
  }

  render() {
    return (
      <div>
        <button onClick={this.returnValue('create')}>Create Room</button>
        <button onClick={this.returnValue('join')}>Jon Room</button>
      </div>
    )
  }
}


export default RoomButtons;