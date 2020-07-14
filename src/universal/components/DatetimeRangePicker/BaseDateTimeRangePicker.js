import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Datetime from 'react-datetime';
import './BaseDateTimeRangePicker.less';

// See https://github.com/snamoah/react-datetime-range-picker/

class BaseDateTimeRangePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: null,
            end: null,
            startDate: null,
            endDate: null
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return nextProps.startDate === prevState.startDate
            && nextProps.endDate === prevState.endDate
            ? {}
            : {
                start: moment(nextProps.startDate) || moment(),
                end: moment(nextProps.endDate) || moment(),
                startDate: nextProps.startDate,
                endDate: nextProps.endDate
            };
    }

    onStartDateChange = (date) => {
        if (typeof date === 'string') {
            return;
        }

        const options = {
            start: date
        };

        if (this.state.end.isBefore(date)) {
            options.end = date.add(1, 'd');
        }

        this.setState(options, () => {
            this.props.onChange(this.propsToPass());
            this.props.onStartDateChange(this.propsToPass().start);
        });
    }

    onEndDateChange = (date) => {
        if (typeof date === 'string') {
            return;
        }

        this.setState({end: date}, () => {
            this.props.onChange(this.propsToPass());
            this.props.onEndDateChange(this.propsToPass().end);
        });
    }

    onFocus = () => {
        this.props.onFocus();
    }

    onBlur = () => {
        this.props.onBlur(this.propsToPass());
    }

    getInputProps = () => {
        const inputReadOnlyStyle = {
            cursor: 'pointer',
            backgroundColor: 'white',
            border: '1px solid #e2e2e2'
        };
        return this.props.input
            ? this.props.inputProps
            : {
                input: true,
                inputProps: {
                    ...this.props.inputProps, // merge inputProps with default
                    readOnly: true,
                    style: inputReadOnlyStyle
                }
            };
    }

    propsToPass = () => ({
        end: this.state.end.toDate(),
        start: this.state.start.toDate()
    })

    calcBaseProps = () => ({
        utc: this.props.utc,
        locale: this.props.locale,
        input: !this.props.inline,
        viewMode: this.props.viewMode,
        dateFormat: this.props.dateFormat,
        timeFormat: this.props.timeFormat,
        closeOnTab: this.props.closeOnTab,
        className: this.props.pickerClassName,
        closeOnSelect: this.props.closeOnSelect
    })


    calcStartTimeProps = () => {
        const baseProps = this.calcBaseProps();
        const inputProps = this.getInputProps();
        return {
            ...baseProps,
            ...inputProps,
            value: this.state.start,
            onBlur: this.props.onStartDateBlur,
            onFocus: this.props.onStartDateFocus,
            timeConstraints: this.props.startTimeConstraints
        };
    }

    calcEndTimeProps = () => {
        const baseProps = this.calcBaseProps();
        const inputProps = this.getInputProps();
        return {
            ...baseProps,
            ...inputProps,
            onBlur: this.props.onEndDateBlur,
            value: this.state.end,
            onFocus: this.props.onEndDateFocus,
            timeConstraints: this.props.endTimeConstraints
        };
    }

    validateMinDate = (date) => this.state.start.isSameOrBefore(date, 'day');

    isValidEndDate = (currentDate, selectedDate) => (this.validateMinDate(currentDate)
        && this.props.isValidEndDate(currentDate, selectedDate));

    renderDay = (props, currentDate) => {
        const {start, end} = this.state;
        const {...rest} = props;
        const date = moment(props.key, 'M_D');

        // style all dates in range
        let classes = date.isBetween(start, end, 'day')
            ? `${props.className} in-selecting-range` : props.className;

        // add rdtActive to selected startdate and endDate in pickers
        classes = date.isSame(start, 'day') || date.isSame(end, 'day') ? `${classes} rdtActive` : classes;

        return (
            <td
                {...rest} // eslint-disable-line
                className={classes}
            >
                {currentDate.date()}
            </td>
        );
    }

    render() {
        const startProps = this.calcStartTimeProps();
        const endProps = this.calcEndTimeProps();

        return (
            <div
                className={`rdt-container ${this.props.className}`}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                role="button"
            >
                <Datetime
                    {...startProps} // eslint-disable-line
                    isValidDate={this.props.isValidStartDate}
                    onChange={this.onStartDateChange}
                    renderDay={this.renderDay}
                    inputProps={{disabled: this.props.disabled}}
                />

                <Datetime
                    {...endProps} // eslint-disable-line
                    isValidDate={this.isValidEndDate}
                    onChange={this.onEndDateChange}
                    renderDay={this.renderDay}
                    inputProps={{disabled: this.props.disabled}}
                />
            </div>
        );
    }
}

BaseDateTimeRangePicker.defaultProps = {
    utc: false,
    locale: null,
    input: false, // This defines whether or not to to edit date manually via input
    inline: false, // This defines whether or not to show input field
    className: '',
    viewMode: 'days',
    dateFormat: true,
    timeFormat: true,
    closeOnTab: true,
    onBlur: () => {},
    onFocus: () => {},
    onChange: () => {},
    pickerClassName: '',
    defaultEndDate: new Date(),
    endDate: new Date(),
    closeOnSelect: false,
    inputProps: null,
    startDate: new Date(),
    defaultStartDate: new Date(),
    onEndDateBlur: () => {},
    endTimeConstraints: {},
    onEndDateFocus: () => {},
    isValidStartDate: () => true,
    isValidEndDate: () => true,
    onStartDateBlur: () => {},
    onEndDateChange: () => {}, // This is called after onChange
    onStartDateFocus: () => {},
    startTimeConstraints: {},
    onStartDateChange: () => {}, // This is called after onChange
    disabled: false
};


BaseDateTimeRangePicker.propTypes = {
    utc: PropTypes.bool,
    input: PropTypes.bool,
    inline: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    locale: PropTypes.string,
    onChange: PropTypes.func,
    viewMode: PropTypes.oneOf(['years', 'months', 'days', 'time']),
    closeOnTab: PropTypes.bool,
    className: PropTypes.string,
    inputProps: PropTypes.object,   // eslint-disable-line
    closeOnSelect: PropTypes.bool,
    isValidEndDate: PropTypes.func,
    onEndDateBlur: PropTypes.func,
    onEndDateFocus: PropTypes.func,
    onEndDateChange: PropTypes.func,
    onStartDateBlur: PropTypes.func,
    isValidStartDate: PropTypes.func,
    onStartDateFocus: PropTypes.func,
    onStartDateChange: PropTypes.func,
    pickerClassName: PropTypes.string,
    defaultEndDate: PropTypes.oneOfType([
        PropTypes.instanceOf(moment), PropTypes.instanceOf(Date), PropTypes.string]),
    endDate: PropTypes.oneOfType([
        PropTypes.instanceOf(moment), PropTypes.instanceOf(Date), PropTypes.string]),
    endTimeConstraints: PropTypes.object,   // eslint-disable-line
    startDate: PropTypes.oneOfType([
        PropTypes.instanceOf(moment), PropTypes.instanceOf(Date), PropTypes.string]),
    defaultStartDate: PropTypes.oneOfType([
        PropTypes.instanceOf(moment), PropTypes.instanceOf(Date), PropTypes.string]),
    startTimeConstraints: PropTypes.object,   // eslint-disable-line
    dateFormat: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    timeFormat: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    disabled: PropTypes.bool
};

export default BaseDateTimeRangePicker;
