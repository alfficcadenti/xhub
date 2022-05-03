import React, {useState, useRef, useEffect} from 'react';
import {DatetimeRangePicker} from '../DatetimeRangePicker';
import {getTzFormat} from '../TimeZonePicker/utils';
import {CALENDAR__16} from '@homeaway/svg-defs';
import {SVGIcon} from '@homeaway/react-svg';
import {getPresets} from '../../pages/utils';
import './styles.less';


const DateFiltersWrapper = ({isFormDisabled, pendingStart, pendingEnd, handleApplyFilters, handleDatetimeChange, isDirtyForm, showTimePicker, enableTimeZone}) => {
    const [openDateFilter, setOpenDateFilter] = useState(false);
    const ref = useRef(null);
    const dateTimeFormat = 'MMM Do YY hh:mm A';

    const formatDate = (date) => enableTimeZone ? getTzFormat(date, dateTimeFormat) : date.format(dateTimeFormat);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setOpenDateFilter(false);
        }
    };

    const handleApply = () => {
        setOpenDateFilter(false);
        handleApplyFilters();
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });

    const renderDateTimePicker = () => (
        <div ref={ref} className="datetime-range-picker-container">
            <DatetimeRangePicker
                onChange={handleDatetimeChange}
                startDate={pendingStart && pendingStart.toDate()}
                endDate={pendingEnd && pendingEnd.toDate()}
                presets={getPresets()}
                disabled={isFormDisabled}
                showTimePicker={showTimePicker}
            />
            <button
                className="btn btn-primary apply-btn"
                type="button"
                onClick={handleApply}
                disabled={!isDirtyForm}
            >
                {'Apply'}
            </button>
        </div>
    );

    return (
        <div className="date-filters-wrapper">
            <div
                className={`btn btn-default dates-button ${openDateFilter ? 'active' : ''}`}
                onClick={() => setOpenDateFilter(!openDateFilter)}
                onKeyUp={(e) => e.key === 'Enter' && setOpenDateFilter(!openDateFilter)}
                role="button"
                tabIndex="0"
            >
                <span><SVGIcon usefill markup={CALENDAR__16} /></span>
                <div className="dates">
                    <div>{formatDate(pendingStart)}</div>
                    <div>{formatDate(pendingEnd)}</div>
                </div>
            </div>
            {openDateFilter && renderDateTimePicker()}
        </div>
    );
};

export default DateFiltersWrapper;
