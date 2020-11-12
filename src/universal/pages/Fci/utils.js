import React from 'react';
import moment from 'moment';
import qs from 'query-string';
import DataTable from '../../components/DataTable';
import {LOB_LIST} from '../../constants';
import {ALL_ERROR_CODES, TOP_10_ERROR_CODES, TOP_20_ERROR_CODES, TRACE_TABLE_COLUMNS} from './constants';

export const getNowDate = () => moment().endOf('minute').toDate();

export const getLastDate = (value, unit) => moment().subtract(value, unit).startOf('minute').toDate();

export const getValue = (value, unit) => ({start: getLastDate(value, unit), end: getNowDate()});

export const getPresets = () => [
    {text: 'Last 15 minutes', value: getValue(15, 'minutes')},
    {text: 'Last 30 minutes', value: getValue(30, 'minutes')},
    {text: 'Last 1 hour', value: getValue(1, 'hour')},
    {text: 'Last 3 hours', value: getValue(3, 'hours')},
    {text: 'Last 6 hours', value: getValue(6, 'hours')},
    {text: 'Last 12 hours', value: getValue(12, 'hours')},
    {text: 'Last 24 hours', value: getValue(24, 'hours')}
];

// eslint-disable-next-line complexity
export const validDateRange = (start, end) => {
    if (!start || !end) {
        return false;
    }
    const startMoment = moment(start);
    const endMoment = moment(end);
    return startMoment.isValid() && endMoment.isValid() && startMoment.isBefore(new Date()) && endMoment.isAfter(startMoment);
};

// eslint-disable-next-line complexity
export const getQueryValues = (search) => {
    const {from, to, lobs, errorCode} = qs.parse(search);
    const initialLobs = lobs
        ? lobs.split(',').map((l) => LOB_LIST.find(({value}) => value === l)).filter((l) => l)
        : [];
    const isValidDateRange = validDateRange(from, to);
    return {
        initialStart: isValidDateRange ? moment(from) : moment().subtract(1, 'hours').startOf('minute'),
        initialEnd: isValidDateRange ? moment(to) : moment(),
        initialTimeRange: isValidDateRange ? 'Custom' : 'Last 1 Hour',
        initialLobs,
        initialErrorCode: errorCode || TOP_20_ERROR_CODES
    };
};

export const getQueryString = (start, end, selectedLobs, selectedErrorCode) => {
    const dateQuery = `from=${start.toISOString()}&to=${end.toISOString()}`;
    const lobQuery = selectedLobs.length
        ? `&lobs=${selectedLobs.map((lob) => lob.value).join(',')}`
        : '';
    const errorQuery = `&errorCode=${selectedErrorCode}`;
    return `${dateQuery}${lobQuery}${errorQuery}`;
};

const initTimeKeys = (start, end) => {
    const tick = 15;
    const keys = [];
    const roundedStartMinutes = Math.floor(start.minute() / tick) * tick;
    const curr = start.clone().minute(roundedStartMinutes).second(0);
    while (curr.isSameOrBefore(end)) {
        keys.push(curr.format('YYYY-MM-DD HH:mm'));
        curr.add(tick, 'minutes');
    }
    return keys;
};

export const getLineChartData = (start, end, rows, selectedErrorCode) => {
    const filteredRows = [ALL_ERROR_CODES, TOP_10_ERROR_CODES, TOP_20_ERROR_CODES].includes(selectedErrorCode)
        ? rows
        : rows.filter(({errorCode}) => Number(errorCode) === Number(selectedErrorCode));
    const errorCodes = filteredRows.reduce((acc, curr) => {
        acc[curr.errorCode] = 0;
        return acc;
    }, {});
    const counter = initTimeKeys(start, end).reduce((acc, curr) => {
        acc[curr] = JSON.parse(JSON.stringify(errorCodes));
        return acc;
    }, {});
    const errorTotals = {};
    filteredRows.forEach(({timestamp, errorCode}) => {
        const date = moment(timestamp);
        const roundedMinutes = Math.floor(date.minute() / 15) * 15;
        const key = date.clone().minute(roundedMinutes).second(0).format('YYYY-MM-DD HH:mm');
        if (counter[key]) {
            errorTotals[errorCode] = (errorTotals[errorCode] || 0) + 1;
            counter[key][errorCode]++;
        }
    });
    const topErrors = Object.entries(errorTotals)
        .sort((a, b) => b.count - a.count)
        .map(([key]) => key);
    const data = Object.entries(counter)
        .map(([date, counts]) => Object.assign({name: date}, counts))
        .sort((a, b) => b.counts - a.counts);
    const keys = Object.keys(errorCodes);
    if (selectedErrorCode === TOP_10_ERROR_CODES) {
        const top10Errors = topErrors.slice(0, 10);
        return {keys: keys.filter((key) => top10Errors.includes(key)), data};
    } else if (selectedErrorCode === TOP_20_ERROR_CODES) {
        const top20Errors = topErrors.slice(0, 20);
        return {keys: keys.filter((key) => top20Errors.includes(key)), data};
    }
    return {keys, data};
};

const getTagValue = (tags, property) => {
    const foundIdx = tags.findIndex(({key}) => (key || '').includes(property));
    if (foundIdx > -1) {
        return tags[foundIdx].value || '-';
    }
    return '-';
};

// eslint-disable-next-line complexity
const mapTrace = (t) => {
    const tags = t.tags || [];
    const errorIdx = tags.findIndex(({key}) => key === 'error');
    const Error = errorIdx > -1 ? tags[errorIdx].value : '-';
    const hasError = Error === 'true';
    const result = {
        Service: t.serviceName,
        Operation: t.operationName,
        Error,
        'External Error Code': '-',
        'External Description': '-',
        'Event Category': '-',
        'Event Description': '-',
        Tags: '-',
        traces: t.traces,
        Traces: !t.traces || !t.traces.length ? null : (
            <DataTable
                title={`Trace Log (ID=${t.traceId})`}
                data={t.traces.map(mapTrace)}
                rules={[{column: 'Error', setClass: (val) => val === 'true' ? 'error-cell' : 'success-cell'}]}
                columns={TRACE_TABLE_COLUMNS}
                expandableColumns={['Traces']}
            />
        )
    };
    if (hasError) {
        result['Error Code'] = getTagValue(tags, 'externalerrorcode');
        result['External Description'] = getTagValue(tags, 'externalerrordescription');
        result['Event Category'] = getTagValue(tags, 'EventCategory');
        result['Event Description'] = getTagValue(tags, 'EventDescription');
    }
    return result;
};

export const getTableData = (data, keys, onOpenTraceLog) => {
    const result = data
        .filter(({errorCode}) => keys.includes(`${errorCode}`))
        .map((row) => {
            const clickHandler = () => onOpenTraceLog(row.traceId, (row.traces || []).map(mapTrace));
            return {
                Created: moment(row.timestamp).format('YYYY-MM-DD HH:mm'),
                Session: row.sessionId,
                Trace: row.traceId,
                Failure: row.failure,
                'Intentional': row.isIntentional,
                'Error Code': row.errorCode,
                Site: row.site,
                TPID: row.tpId,
                EAPID: row.eapId,
                'SiteID': row.siteId,
                LoB: (LOB_LIST.find((l) => l.value === row.lineOfBusiness) || {label: '-'}).label,
                Traces: (
                    <div
                        className="log-link"
                        role="button"
                        tabIndex={0}
                        onClick={clickHandler}
                        onKeyUp={clickHandler}
                    >
                        {'Open Log'}
                    </div>
                )
            };
        });
    result.sort((a, b) => b.Created.localeCompare(a.Created));
    return result;
};

export const getErrorCodes = (data) => {
    const errorCodeSet = data.reduce((acc, {errorCode}) => {
        acc.add(String(errorCode));
        return acc;
    }, new Set());
    const errorCodes = Array.from(errorCodeSet).sort();
    return [ALL_ERROR_CODES, TOP_10_ERROR_CODES, TOP_20_ERROR_CODES, ...errorCodes];
};

export const getElements = (data, height = 0, breadth = 0, parent = null) => {
    const type = !parent ? 'input' : 'default';
    // eslint-disable-next-line complexity
    const elements = data.reduce((acc, fci, depth) => {
        const id = `${String(fci.Trace || fci.traceId)}`;
        const hasChildren = fci.traces && fci.traces.length;
        acc.push({
            id,
            type: hasChildren ? type : 'output',
            data: {
                label: `id=${id},
                    service=${fci.Service || fci.serviceName},
                    operation=${fci.Operation || fci.operationName},
                    error=${fci.tags ? fci.tags[0].value : fci.Error}`
            },
            sourcePosition: 'right',
            targetPosition: 'left',
            position: {x: 16 + (breadth * 200), y: 16 + ((height + depth) * 152)}
        });
        if (fci.traces && fci.traces.length) {
            acc = [...acc, ...fci.traces.map((t) => ({
                id: `edge-${t.traceId}`,
                source: id,
                target: t.traceId,
                arrowHeadType: 'arrowclosed'
            }))];
            acc = [...acc, ...getElements(fci.traces, height + data.length + depth, breadth + 1, id)];
        }
        return acc;
    }, []);
    return elements;
};
