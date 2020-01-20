import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './ButtonAlert.css';

class ButtonAlert extends Component {
    render() {
        return (
            <p>
                <button className="button button-primary margin-right" onClick={this.props.onClick}>{this.props.text}</button>
                This button <strong className={styles.blue}>does something.</strong>.
            </p>
        );
    }
}

ButtonAlert.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string
};
export default ButtonAlert;
