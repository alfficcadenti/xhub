import React from 'react';
import {Dropdown, DropdownItem} from '@homeaway/react-dropdown';
import {getTimeZones} from './utils';
import './styles.less';


const TimeZonePicker = ({timeZone, onChange}) => (
    <Dropdown
        id="timezone-picker"
        label={timeZone}
        className="timezone-picker"
        dropdownRight
        noArrow
        closeAfterContentClick
    >
        {getTimeZones().map(({label, value}) => (
            <DropdownItem
                key={label}
                text={label}
                link="#"
                onClick={() => onChange(value)}
            />
        ))}
    </Dropdown>
);

export default TimeZonePicker;
