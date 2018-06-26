import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.css';

export const Button = (props) => {
  const { children, className, ...otherProps } = props;
  let realClassName = typeof className === 'string'
  ? className + ` ${styles.Button}`
  : styles.Button;

  return (
    <button className={realClassName} { ...otherProps }>
      {children}
    </button>
  );
}

export const ButtonLink = (props) => {
  const { children, className, ...otherProps } = props;
  let realClassName = typeof className === 'string'
  ? className + ` ${styles.Button}`
  : styles.Button;

  return (
    <Link className={realClassName} { ...otherProps }>
      {children}
    </Link>
  );
}