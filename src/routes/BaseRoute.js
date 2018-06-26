import React, { Component } from 'react';
import { ButtonLink } from '../components/Button/Button';
import styles from './BaseRoute.css';

class BaseRoute extends Component {

  render() {
    return (
      <div className={styles.BaseRoute}>
        <ButtonLink to="/create">Create</ButtonLink>
        <ButtonLink to="/join">Join</ButtonLink>
      </div>
    );
  }

}




export default BaseRoute;
