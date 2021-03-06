import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toggleNotifications, toggleShowNotification } from '../../actions/chat';
import styles from './Header.css';

class Header extends Component {

  constructor (props) {
    super(props);
    this.state = {
      notificationSupport: false,
    };
    
    this.notificationButtonClick = this.notificationButtonClick.bind(this);
  }

  componentDidMount() {
    const { toggleShowNotification, sendNotifications } = this.props;
    if ('Notification' in window) {
      this.setState({
        ...this.state,
        notificationSupport: true,
      });
    }

    if (sendNotifications && document.hidden) toggleShowNotification(true);

    document.addEventListener('visibilitychange', () => {
      if (sendNotifications === false) return;
      if (document.hidden) toggleShowNotification(true);
      else toggleShowNotification(false);
    });
  }

  notificationButtonClick() {
    const { permission } = Notification;
    const { toggleNotifications, sendNotifications } = this.props;
    if (permission === 'granted') toggleNotifications();
    else if (permission === 'default') {
      if (sendNotifications === false) {
        Notification.requestPermission((perm) => {
          if (perm === 'granted') return toggleNotifications(true);
        });
      } else toggleNotifications(false);
    } else if(permission === 'denied') {
      if (sendNotifications === true) {
        toggleNotifications(false);
      } else {
        // TODO: Add message that says the below message
        console.log('Please change your notification permission');
      }
    }
  }

  notificationButton() {
    const { sendNotifications } = this.props;
    const classNames = [styles.HeaderNotification];
    if (sendNotifications) classNames.push(styles['HeaderNotification--granted']);

    return (
      <button className={classNames.join(' ')} onClick={this.notificationButtonClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M425.403 330.939c-16.989-16.785-34.546-34.143-34.546-116.083 0-83.026-60.958-152.074-140.467-164.762A31.843 31.843 0 0 0 256 32c0-17.673-14.327-32-32-32s-32 14.327-32 32a31.848 31.848 0 0 0 5.609 18.095C118.101 62.783 57.143 131.831 57.143 214.857c0 81.933-17.551 99.292-34.543 116.078C-25.496 378.441 9.726 448 66.919 448H160c0 35.346 28.654 64 64 64 35.346 0 64-28.654 64-64h93.08c57.19 0 92.415-69.583 44.323-117.061zM224 472c-13.234 0-24-10.766-24-24h48c0 13.234-10.766 24-24 24zm157.092-72H66.9c-16.762 0-25.135-20.39-13.334-32.191 28.585-28.585 51.577-55.724 51.577-152.952C105.143 149.319 158.462 96 224 96s118.857 53.319 118.857 118.857c0 97.65 23.221 124.574 51.568 152.952C406.278 379.661 397.783 400 381.092 400z"/></svg>
      </button>
    );
  }

  render() {
    const button = this.state.notificationSupport !== true
    ? null
    : this.notificationButton();

    return (
      <header className={styles.Header}>
        <h1 className={styles.HeaderTitle}>
          <Link to="/">WebRTC Chat App</Link>
          { button }
        </h1>
      </header>
    );

  }

}

const mapStateToProps = ({ chat }) => {
  return {
    sendNotifications: chat.sendNotifications,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleNotifications: _ => dispatch(toggleNotifications(_)),
    toggleShowNotification: _ => dispatch(toggleShowNotification(_)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);