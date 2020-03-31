import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FormTextArea} from '@homeaway/react-form-components';

class InputText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            error: ''
        };
    }

    onChange = (event) => {
        this.setState({
            value: event.target.value
        });
    }

    render() {
        const {
            id,
            question,
            value
        } = this.props;

        return (
            <FormTextArea
                key={id || 0}
                id={id}
                name={id}
                label={question}
                onChange={this.onChange}
                value={this.state.value || value}
                autoExpand
            />
        );
    }
}

InputText.defaultProps = {
    question: ''
};

InputText.propTypes = {
    id: PropTypes.string.isRequired,
    question: PropTypes.string,
};

export default InputText;