import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './BaseRoute.css';

class BaseRoute extends Component {

  render() {
    return (
      <div className="base-route">
        <Link to="/create" className="button">Create</Link>
        <Link to="/join" className="button">Join</Link>
      </div>
    );
  }

}




export default BaseRoute;
