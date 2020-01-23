import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';


class DayTemplatePast extends Component {
    static propTypes = {
        day: PropTypes.number,
        isPast: PropTypes.bool,
        isToday: PropTypes.bool,
        dayData: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]) // eslint-disable-line react/forbid-prop-types
    }

    render() {
        const {
            day,
            isPast,
            isToday
        } = this.props;

        const dayClassName = classNames('date', {
            'not': !isPast && !isToday
        });

        return (
            <div className={dayClassName} aria-hidden="true">
                {day}
                <p className="hidden">{day}</p>
            </div>
        );
    }
}

// date can be clicked
DayTemplatePast.canClick = (props) => {
    const {isPast, isToday} = props;
    return (isPast || isToday);
};

// date can be clicked or spanned
DayTemplatePast.canHover = (props) => {
    const {isPast, isToday} = props;
    return (isPast || isToday);
};

export default DayTemplatePast;
