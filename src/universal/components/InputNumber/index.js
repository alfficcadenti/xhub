/* eslint-disable no-unused-expressions */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FormInput} from '@homeaway/react-form-components';
import h from '../../components/utils/formatString';

class InputNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            error: ''
        };
    }

    onlyInteger = (event) => (event.key === '.' ? true : false)

    onlyPositives = (event) => (event.key === '-' ? true : false)

    outsideRange = (value, min, max) => ((!(max && value > max) && !(value < min)) ? false : true)

    decimals = (value) => {
        if (Math.floor(value) === value) {
            return 0;
        }
        return value.toString().split('.')[1] || 0;
    };

    helpTextString = (range) => {
        let result = '';

        if (range.min) {
            if (!range.max) {
                result = `minimum value ${range.min}`;
            } else {
                result = `value between ${range.min} - ${range.max}`;
            }
        }

        return result;
    };

    // eslint-disable-next-line complexity
    validation = (event) => {
        const {range, type} = this.props;
        if (type === 'integer' && this.onlyInteger(event)
            || this.decimals(event.target.value) && this.decimals(event.target.value).length >= 2
            || range.min >= 0 && this.onlyPositives(event)) {
            event.preventDefault();
        }
    };

    checkValue = (event) => {
        const {range} = this.props;
        (this.outsideRange(event.target.value, Number(range.min), Number(range.max)))
            ? this.setState({value: event.target.value, error: 'Error: value is not valid'})
            : this.setState({value: event.target.value, error: ''});
    }

    render() {
        const {
            id,
            question,
            range,
            value
        } = this.props;

        const helpText = this.helpTextString(range);

        return (
            <FormInput
                key={id}
                id={h.replaceSpaces(question)}
                label={question}
                type="number"
                onChange={this.checkValue}
                onKeyPress={this.validation}
                value={value || this.state.value}
                errorMsg={this.state.error}
                helpText={helpText}
            />
        );
    }
}

InputNumber.defaultProps = {
    id: null,
    question: '',
    type: null,
    range: {min: '', max: ''},
    value: ''
};

InputNumber.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    question: PropTypes.string,
    type: PropTypes.string,
    range: PropTypes.shape({
        min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        max: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default InputNumber;
