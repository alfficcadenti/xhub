import React from 'react';
import PropTypes from 'prop-types';
import styles from './ButtonAlert.css';

const ButtonAlert = ({onClick, text}) => (<p>
    <button className="button button-primary margin-right" onClick={onClick}>{text}</button>
    {'This button'} <strong className={styles.blue}>{'does something.'}</strong>{'.'}
</p>);

ButtonAlert.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string
};

export default ButtonAlert;
