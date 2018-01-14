import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class BaseRoute extends Component {

  render() {
    return (
      <div>
        <Link to="/create">Create</Link>
        <Link to="/join">Join</Link>
      </div>
    )
  }

}




export default BaseRoute;
