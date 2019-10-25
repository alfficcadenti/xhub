import React, {Component} from 'react';
import classNames from 'classNames';
import PropTypes from 'prop-types'; 


class DayAvailability extends Component {
    static propTypes = {
        day: PropTypes.number,
        isPast: PropTypes.bool,
            isToday: PropTypes.bool,
        dayData: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]) // eslint-disable-line react/forbid-prop-types
    }

    render() {
        const {
            day,
            isPast
        } = this.props;

        const dayClassName = classNames('day-availability', {
            'day-availability--disabled': !isPast
        });


        return (
            <div className={dayClassName}>
                <div className="day-availability__content">
                    <div className="day-availability__day">{day}</div>
                </div>
            </div>
        );
    }
}

// date can be clicked
DayAvailability.canClick = (props) => {
    const {isPast, isToday} = props;
    return (isPast || isToday);
};

// date can be clicked or spanned
DayAvailability.canHover = (props) => {
    const {dayData, isPast, isToday} = props;
    const {inPast} = dayData;
    return (isPast || inPast || isToday);
};

export default DayAvailability;
