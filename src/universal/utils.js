import moment from 'moment';

export const formatToLocalDateTimeString = (m) => moment.utc(m).local().format('YYYY-MM-DD HH:mm');

export const getOrDefault = (item, property, defaultVal = '-', transformFn, transformFnParam) => {
    if (!item?.[property]) {
        return defaultVal;
    }
    if (transformFn) {
        return transformFn(item[property], transformFnParam) || defaultVal;
    }
    return item[property];
};
