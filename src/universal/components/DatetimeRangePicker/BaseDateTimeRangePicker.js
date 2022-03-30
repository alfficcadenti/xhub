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
        if (moment(startDate).format(format) !== moment(startInputRef.current.value, format).format(format) || moment(endDate).format(format) !== moment(endInputRef.current.value, format).format(format)) {
            onChange({
                end: moment(endInputRef.current.value, format).toDate(),
                start: moment(startInputRef.current.value, format).toDate()
            });
        }
    };

    function useOutsideAlerter(ref) {
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    if (calendarOpen === true) {
                        onBlur();
                    }
                    setCalendarOpen(false);
                    setFocusOnDate(null);
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

    const validateEndDateChange = (date) => {
        if (moment(date, format).isBefore(moment(startInputRef.current.value, format))) {
            startInputRef.current.value = moment(date, format).subtract(1, interval).format(format);
            setStart(moment(endInputRef.current.value, format).subtract(1, interval).format(format));
        }
    };

    const validateStartDateChange = (date) => {
        if (moment(date, format).isAfter(moment(endInputRef.current.value, format))) {
            endInputRef.current.value = moment(date, format).add(1, interval).format(format);
            setEnd(moment(startInputRef.current.value, format).add(1, interval).format(format));
        }
    };

    const handleInputOnBlur = (type) => {
        if (type === 'start') {
            if (moment(startInputRef.current.value, format).isValid()) {
                startInputRef.current.value = moment(startInputRef.current.value, format).format(format);
                setStart(moment(startInputRef.current.value, format).format(format));
                validateStartDateChange(startInputRef.current.value);
            } else {
                startInputRef.current.value = moment(start).format(format);
            }
        }
        if (type === 'end') {
            if (moment(endInputRef.current.value, format).isValid()) {
                endInputRef.current.value = moment(endInputRef.current.value, format).format(format);
                setEnd(moment(endInputRef.current.value, format).format(format));
                validateEndDateChange(endInputRef.current.value);
            } else {
                endInputRef.current.value = moment(end).format(format);
            }
        }
    };

    const handleCalendarOnChange = (e) => {
        if (focusOnDate === 'end') {
            setEnd(moment(e).format(format));
            endInputRef.current.value = moment(e).format(format);
            validateEndDateChange(e);
            if (!moment(e).isSame(end, 'day')) {
                setFocusOnDate(null);
                setCalendarOpen(false);
            }
        } else if (focusOnDate === 'start') {
            if (!moment(e).isSame(start, 'day')) {
                setFocusOnDate('end');
            }
            setStart(moment(e).format(format));
            startInputRef.current.value = moment(e).format(format);
            validateStartDateChange(e);
        }
    };

    useEffect(() => {
        onChange({
            end: moment(end, format).toDate(),
            start: moment(start, format).toDate()
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end]);

    useEffect(() => {
        if (moment(startDate).format(format) !== moment(startInputRef.current.value, format).format(format)) {
            startInputRef.current.value = moment(startDate).format(format);
        }
        if (moment(endDate).format(format) !== moment(endInputRef.current.value, format).format(format)) {
            endInputRef.current.value = moment(endDate).format(format);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

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

    const getInputValue = (type) => startDate && endDate && type === 'start' ? moment(startDate).format(format) : moment(endDate).format(format);

    const renderInput = (type) => (
        <div className={`rdt-${type}-container`} key={`rdt-${type}-container`}>
            <label className={`rdt-${type}-label`} htmlFor={`datepicker-${type}-date`}>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
            <div className="rdt">
                <input
                    ref={type === 'start' ? startInputRef : endInputRef}
                    className={inputClass(type)}
                    type={'text'}
                    id={`datepicker-${type}-date`}
                    defaultValue={getInputValue(type)}
                    onClick={() => handleOnClick(type)}
                    disabled={disabled}
                    onKeyUp={(e) => e.key === 'Enter' && onBlur()}
                    onBlur={() => handleInputOnBlur(type)}
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
                value={focusOnDate === 'end' ? moment(end, format) : moment(start, format)}
                input={false}
                isValidDate={isValidEndDate}
                onChange={handleCalendarOnChange}
                renderDay={renderDay}
                onClose={onBlur}
                timeFormat={timeFormat}
                disabled={disabled}
            />}
        </div>
    );
};

export default BaseDateTimeRangePicker;