import React, {useState, useRef, useEffect} from 'react';
import {DatetimeRangePicker} from '../DatetimeRangePicker';
import {CALENDAR__16} from '@homeaway/svg-defs';
import {SVGIcon} from '@homeaway/react-svg';
import moment from 'moment/moment';
import './styles.less';


const DateFiltersWrapper = ({isFormDisabled, pendingStart, pendingEnd, handleApplyFilters, handleDatetimeChange, isDirtyForm}) => {
    const [openDateFilter, setOpenDateFilter] = useState(false);

    const getNowDate = () => moment().endOf('minute').toDate();
    const getLastDate = (value, unit) => moment().subtract(value, unit).startOf('minute').toDate();
    const getValue = (value, unit) => ({start: getLastDate(value, unit), end: getNowDate()});
    const ref = useRef(null);

    const getPresets = () => [
        {text: 'Last 15 minutes', value: getValue(15, 'minutes')},
        {text: 'Last 30 minutes', value: getValue(30, 'minutes')},
        {text: 'Last 1 hour', value: getValue(1, 'hour')},
        {text: 'Last 3 hours', value: getValue(3, 'hours')},
        {text: 'Last 6 hours', value: getValue(6, 'hours')},
        {text: 'Last 12 hours', value: getValue(12, 'hours')},
        {text: 'Last 24 hours', value: getValue(24, 'hours')}
    ];

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setOpenDateFilter(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });

    return (
        <div className="date-filters-wrapper">
            <div
                className={`btn btn-default dates-button ${openDateFilter ? 'active' : ''}`}
                onClick={() => setOpenDateFilter(!openDateFilter)}
            >
                <span><SVGIcon usefill markup={CALENDAR__16} /></span>
                <div className="dates">
                    <div>
                        {pendingStart.format('MMM Do YY h:mm:ss a')}
                    </div>
                    <div>
                        {pendingEnd.format('MMM Do YY h:mm:ss a')}
                    </div>
                </div>
            </div>
            {openDateFilter && <div ref={ref} className="datetime-range-picker-container">
                <DatetimeRangePicker
                    onChange={handleDatetimeChange}
                    startDate={pendingStart && pendingStart.toDate()}
                    endDate={pendingEnd && pendingEnd.toDate()}
                    presets={getPresets()}
                    disabled={isFormDisabled}
                />
                <button
                    className="btn btn-primary apply-btn"
                    type="button"
                    onClick={() => {
                        setOpenDateFilter(false);
                        handleApplyFilters();
                    }
                    }
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
            </div>}
        </div>
    );
};

export default DateFiltersWrapper;
