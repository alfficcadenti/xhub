import moment from 'moment';
import 'moment-timezone';
import {TIME_ZONES} from './constants';

let DEFAULT_TIMEZONE;

const getDefaultTimezone = () => (
    DEFAULT_TIMEZONE || moment.tz(moment.tz.guess()).zoneAbbr()
);

const setTimeZone = (timeZone) => (
    localStorage.setItem('timezone', timeZone || getDefaultTimezone())
);

const getTimeZone = () => (
    typeof window !== 'undefined'
        ? localStorage.getItem('timezone') || getDefaultTimezone()
        : getDefaultTimezone()
);

const getTimeZones = () => TIME_ZONES;

const getZoneAbr = () => {
    const timeZone = getTimeZone();
    const zoneAbr = (timeZone === getDefaultTimezone())
        ? getDefaultTimezone()
        : moment.tz(`${timeZone}`).zoneAbbr();
    return zoneAbr;
};

const getTzFormat = (date, format = 'YYYY-MM-DD HH:mm') => {
    const timeZone = getTimeZone();
    const startedDate = (timeZone === getDefaultTimezone())
        ? moment.utc(date).local().format(format)
        : moment.utc(date).tz(`${timeZone}`).format(format);
    return startedDate;
};

export {
    setTimeZone,
    getTimeZone,
    getTimeZones,
    getTzFormat,
    getZoneAbr
};
