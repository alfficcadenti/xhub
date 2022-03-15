import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import Datetime from 'react-datetime';
import './BaseDateTimeRangePicker.less';


const BaseDateTimeRangePicker = ({
    startDate = moment().toDate(),
    endDate = moment().toDate(),
    className = '',
    timeFormat = false,
    disabled = false,
    isValidEndDate = () => true,
    onChange = () => {}
}) => {
    const containerRef = useRef(null);

    const format = timeFormat ? 'MM/DD/YYYY HH:mm' : 'MM/DD/YYYY';
    const interval = timeFormat ? 'h' : 'd';

    const [start, setStart] = useState(moment(startDate).format(format));
    const [end, setEnd] = useState(moment(endDate).format(format));
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [focusOnDate, setFocusOnDate] = useState(null);
    const startInputRef = useRef(null);
    const endInputRef = useRef(null);


    const onBlur = () => {
        setCalendarOpen(false);
        setFocusOnDate(null);
        startInputRef.current.blur();
        endInputRef.current.blur();
    };

    function useOutsideAlerter(ref) {
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    onBlur();
                }
            };

            // Bind the event listener
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [ref]);
    }

    useOutsideAlerter(containerRef);

    const handleOnClick = (e) => {
        setFocusOnDate(e);
        setCalendarOpen(true);
    };

    const handleEndDateChange = (e) => {
        if (!moment(e).isSame(end, 'day')) {
            setFocusOnDate(null);
            setEnd(moment(e).format(format));
            setCalendarOpen(false);
        } else {
            setEnd(moment(e).format(format));
        }
        if (moment(e).isBefore(moment(start))) {
            setStart(moment(e).subtract(1, interval).format(format));
        }
    };

    const handleStartDateChange = (e) => {
        if (moment(e).isValid()) {
            if (!moment(e).isSame(start, 'day')) {
                setFocusOnDate('end');
                setStart(moment(e).format(format));
                if (moment(end).isBefore(moment(e))) {
                    setEnd(moment(e).add(1, interval).format(format));
                }
            } else {
                setStart(moment(e).format(format));
                if (moment(end).isBefore(moment(e))) {
                    setEnd(moment(e).add(1, interval).format(format));
                }
            }
        }
    };

    const handleDateChange = (e) => {
        if (focusOnDate === 'end') {
            handleEndDateChange(e);
        } else if (focusOnDate === 'start') {
            handleStartDateChange(e);
        }
    };

    useEffect(() => {
        onChange({
            end: moment(end, format).toDate(),
            start: moment(start, format).toDate()
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end]);

    const renderDay = (props, currentDate) => {
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
    };

    const inputClass = (type) => `form-control ${!timeFormat ? 'short' : ''} ${type === focusOnDate ? 'active' : ''}`;

    const getInputValue = (type) => start && end && type === 'start' ? start : end;

    const handleValueChange = (event, type) => {
        event.preventDefault();
        if (moment(event.target.value).isValid()) {
            if (type === 'start') {
                handleStartDateChange(event.target.value);
                startInputRef.current.focus();
            } else if (type === 'end') {
                handleEndDateChange(event.target.value);
                endInputRef.current.focus();
            }
        }
    };

    const renderInput = (type) => (
        <div className={`rdt-${type}-container`} key={`rdt-${type}-container`}>
            <label className={`rdt-${type}-label`} htmlFor={`datepicker-${type}-date`}>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
            <div className="rdt">
                <input
                    ref={type === 'start' ? startInputRef : endInputRef}
                    className={inputClass(type)}
                    type={'text'}
                    id={`datepicker-${type}-date`}
                    value={getInputValue(type)}
                    onChange={(e) => handleValueChange(e, type)}
                    onClick={() => handleOnClick(type)}
                    disabled={disabled}
                    onKeyUp={(e) => e.key === 'Enter' && onBlur()}
                />
            </div>
        </div>
    );


    return (
        <div className={`rdt-container ${className}`} role="button" ref={containerRef}>
            <div className="rdt-input-container">
                {['start', 'end'].map(renderInput)}
            </div>
            {calendarOpen &&
            <Datetime
                value={focusOnDate === 'end' ? moment(end) : moment(start)}
                input={false}
                isValidDate={isValidEndDate}
                onChange={handleDateChange}
                renderDay={renderDay}
                onClose={onBlur}
                timeFormat={timeFormat}
                disabled={disabled}
            />}
        </div>
    );
};

export default BaseDateTimeRangePicker;