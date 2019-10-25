import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DateRangePicker} from '@homeaway/react-date-pickers';
import DayAvailability from './DayAvailability';
import './styles.less';

class DatePicker extends Component {
    handleDateRangeChange  = (startDate, endDate) => {
        this.props.handleDateRangeChange(startDate, endDate)
    }

    handleClearDates = () => {
        this.props.handleClearDates();
    }

    render() {
        const {startDate = '', endDate = '', minDate = ''} = this.props;
        return (<div className="DatePicker">
            <DateRangePicker
                onDateRangeChange={this.handleDateRangeChange}
                onDateRangeClear={this.handleClearDates}
                inputLabel1="Start"
                inputLabel2="End"
                inputName1="start"
                inputName2="end"
                startDate={startDate}
                endDate={endDate}
                minDate={minDate}
                dayTemplateComponent={DayAvailability}
                
                id='dateRangeFilter'
        />
    </div>
        );
    }
}

DatePicker.propTypes = {
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    minDate: PropTypes.instanceOf(Date),
    handleDateRangeChange: PropTypes.func.isRequired,
    handleClearDates: PropTypes.func.isRequired
}

export default DatePicker;
