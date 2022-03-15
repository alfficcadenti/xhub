import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {Dropdown, DropdownItem} from '@homeaway/react-dropdown';
import ReactDatetimeRangePicker from './BaseDateTimeRangePicker';
import './styles.less';

const getPresets = () => {
    const presets = [{
        text: 'Last 7 Days',
        value: {
            start: moment().subtract(1, 'week').startOf('day').toDate(),
            end: moment().endOf('day').toDate()
        }
    }, {
        text: 'Last 14 Days',
        value: {
            start: moment().subtract(2, 'week').startOf('day').toDate(),
            end: moment().endOf('day').toDate()
        }
    }, {
        text: 'Last 30 Days',
        value: {
            start: moment().subtract(30, 'days').startOf('day').toDate(),
            end: moment().endOf('day').toDate()
        }
    }, {
        text: 'Last 60 Days',
        value: {
            start: moment().subtract(60, 'days').startOf('day').toDate(),
            end: moment().endOf('day').toDate()
        }
    }, {
        text: 'Last 90 Days',
        value: {
            start: moment().subtract(90, 'days').startOf('day').toDate(),
            end: moment().endOf('day').toDate()
        }
    }, {
        text: 'Last Year',
        value: {
            start: moment().subtract(1, 'year').startOf('year').startOf('day')
                .toDate(),
            end: moment().subtract(1, 'year').endOf('year').endOf('day')
                .toDate()
        }
    }, {
        text: 'All Months',
        value: {
            start: moment('2017-12-01').startOf('day').toDate(),
            end: moment().endOf('month').endOf('day').toDate()
        }
    }];
    // Initialize each month date since Dec-1-2017
    const currDate = moment();
    const endDate = moment('2017-12-01');
    while (currDate.diff(endDate, 'days') > 0) {
        presets.push({
            text: currDate.format('MMM YYYY'),
            value: {
                start: currDate.startOf('month').startOf('day').toDate(),
                end: currDate.endOf('month').endOf('day').toDate()
            }
        });
        currDate.subtract(1, 'months');
    }
    return presets;
};

const renderPresets = (presets, onChange) => (
    presets.map((d) => (
        <DropdownItem
            key={d.text}
            link="#"
            text={d.text}
            onClick={() => onChange(d.value, d.text)}
        />
    ))
);

const getPresetLabel = (startDate, endDate, presets, showTimePicker) => {
    const start = moment(startDate);
    const end = moment(endDate);
    let label = 'Custom';
    const unit = showTimePicker ? 'minutes' : 'days';

    (presets || []).forEach((p) => {
        if (start.isSame(p.value.start, unit) && end.isSame(p.value.end, unit)) {
            label = p.text;
        }
    });
    return label;
};

const DatetimeRangePicker = (props) => (
    <div className="datetime-range-picker">
        <ReactDatetimeRangePicker
            onChange={props.onChange}
            startDate={props.startDate}
            endDate={props.endDate}
            disabled={props.disabled}
            timeFormat={props.showTimePicker}
            isValidEndDate={props.isValidEndDate}
        />
        {!props.hidePresets && !props.disabled && (
            <Dropdown
                id="rdt-preset-dropdown"
                label={getPresetLabel(props.startDate, props.endDate, props.presets, props.showTimePicker)}
                className="rdt-preset-dropdown"
                closeAfterContentClick
            >
                {renderPresets(props.presets, props.onChange)}
            </Dropdown>
        )}
    </div>
);


DatetimeRangePicker.defaultProps = {
    hidePresets: false,
    presets: getPresets(),
    disabled: false,
    isValidEndDate: () => true,
    showTimePicker: false
};

DatetimeRangePicker.propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
    presets: PropTypes.arrayOf(PropTypes.shape()),
    hidePresets: PropTypes.bool,
    disabled: PropTypes.bool,
    isValidEndDate: PropTypes.func,
    showTimePicker: PropTypes.bool
};

export {
    getPresets,
    getPresetLabel,
    DatetimeRangePicker
};
