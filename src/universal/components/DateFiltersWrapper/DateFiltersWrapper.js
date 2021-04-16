import React, {useState, useRef, useEffect} from 'react';
import {DatetimeRangePicker} from '../DatetimeRangePicker';
import {CALENDAR__16} from '@homeaway/svg-defs';
import {SVGIcon} from '@homeaway/react-svg';
import {getPresets} from '../../pages/utils';
import './styles.less';


const DateFiltersWrapper = ({isFormDisabled, pendingStart, pendingEnd, handleApplyFilters, handleDatetimeChange, isDirtyForm}) => {
    const [openDateFilter, setOpenDateFilter] = useState(false);
    const ref = useRef(null);

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
