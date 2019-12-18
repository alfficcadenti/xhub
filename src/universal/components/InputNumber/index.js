import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FormInput} from '@homeaway/react-form-components';
import h from '../../components/utils/formatString'

class InputNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            error: ''
        }
    }

    onlyInteger = (event) => (event.key==='.' ? true : false)

    onlyPositives = (event) => (event.key==='-' ? true : false)

    outsideRange = (value,min,max) => ((!(max && value > max) && !(min && value < min)) ? false : true)

    decimals = (value) => {
        if(Math.floor(value) === value) return 0;
        return value.toString().split(".")[1] || 0; 
    }

    helpTextString = (range) => {
        if (range.min && !range.max) {
            return `min value ${range.min}`
        }
        if (range.min && range.max) {
            return `value between ${range.min} - ${range.max}`
        }
    }

    validation = (event) => {
        const {
            range,
            type,
        } = this.props;
        if(type === 'integer') {
            if(this.onlyInteger(event)) {event.preventDefault()}
        } else {
            if(this.decimals(event.target.value) && this.decimals(event.target.value).length >= 2) {event.preventDefault();}
        }
        if(range.min >= 0) {
            if(this.onlyPositives(event)) {event.preventDefault()}
        }
    }

    checkValue = (event) => {
        const {range} = this.props;

        if(this.outsideRange(event.target.value, Number(range.min), Number(range.max))) {
            this.setState({
                error: `Error: value is not valid`,
                value: event.target.value
            })
        } else {
            this.setState({
                value: event.target.value, 
                error:''
            })
        }
    }

    render() {
        const {
            id,
            question,
            range
        } = this.props;

        const helpText = (range.min || range.max) ? this.helpTextString(range) : ''

        return (
            <FormInput
                key={id}
                id={h.replaceSpaces(question)}
                label={question}
                type='number'
                onChange={this.checkValue}
                onKeyPress={this.validation}
                value={this.state.value}
                errorMsg={this.state.error}
                helpText={helpText}
            />
        )
    }
}

InputNumber.defaultProps = {
    id: null,
    question: '',
    type: null,
    range: {min: '', max:''}
};

InputNumber.propTypes = {
    id: PropTypes.string,
    question: PropTypes.string,
    type: PropTypes.string,
    range: PropTypes.object,
};

export default InputNumber;