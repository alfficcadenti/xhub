import React from 'react';
import moment from 'moment';
import qs from 'query-string';
import DataTable from '../../components/DataTable';
import {LOB_LIST} from '../../constants';
import {ALL_ERROR_CODES, TOP_10_ERROR_CODES, TOP_20_ERROR_CODES, TRACE_TABLE_COLUMNS, SITES, ALL_CATEGORIES, CODE_OPTION} from './constants';

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

export const getBrandSites = (brand) => SITES[brand] || ['travel.chase.com'];

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

export const getQueryValues = (search, brand = 'Expedia') => {
    const {from, to, lobs, errorCode, siteName, category, hideIntentionalCheck} = qs.parse(search);
    const isValidDateRange = validDateRange(from, to);
    return {
        initialStart: isValidDateRange ? moment(from) : moment().subtract(1, 'hours').startOf('minute'),
        initialEnd: isValidDateRange ? moment(to) : moment(),
        initialTimeRange: isValidDateRange ? 'Custom' : 'Last 1 Hour',
        initialLobs: lobs
            ? lobs.split(',').map((l) => LOB_LIST.find(({value}) => value === l)).filter((l) => l)
            : [],
        initialErrorCode: errorCode || TOP_20_ERROR_CODES,
        initialSite: getBrandSites(brand).includes(siteName)
            ? siteName
            : getBrandSites(brand)[0],
        initialCategories: category || ALL_CATEGORIES,
        initialHideIntentionalCheck: hideIntentionalCheck === 'true'
    };
};

export const getQueryString = (start, end, selectedLobs, selectedErrorCode, selectedSite, selectedCategory, hideIntentionalCheck) => {
    const dateQuery = `from=${start.toISOString()}&to=${end.toISOString()}`;
    const lobQuery = selectedLobs.length
        ? `&lobs=${selectedLobs.map((lob) => lob.value).join(',')}`
        : '';
    const errorQuery = selectedErrorCode !== TOP_20_ERROR_CODES
        ? `&errorCode=${selectedErrorCode}`
        : '';
    const siteQuery = `&siteName=${selectedSite}`;
    const categoryQuery = selectedCategory !== ALL_CATEGORIES
        ? `&category=${selectedCategory}`
        : '';
    const hideIntentionalCheckQuery = `&hideIntentionalCheck=${hideIntentionalCheck}`;
    return `${dateQuery}${lobQuery}${errorQuery}${siteQuery}${categoryQuery}${hideIntentionalCheckQuery}`;
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

export const getLineChartData = (start, end, rows, selectedErrorCode, chartProperty) => {
    const filteredRows = [ALL_ERROR_CODES, TOP_10_ERROR_CODES, TOP_20_ERROR_CODES].includes(selectedErrorCode)
        ? rows
        : rows.filter(({errorCode}) => Number(errorCode) === Number(selectedErrorCode));
    const initialCounts = filteredRows.reduce((acc, curr) => {
        if (curr[chartProperty]) {
            acc[curr[chartProperty]] = 0;
        }
        return acc;
    }, {});
    const counter = initTimeKeys(start, end).reduce((acc, curr) => {
        acc[curr] = JSON.parse(JSON.stringify(initialCounts));
        return acc;
    }, {});
    const totals = {};
    filteredRows.forEach((row) => {
        const date = moment(row.timestamp);
        const roundedMinutes = Math.floor(date.minute() / 15) * 15;
        const key = date.clone().minute(roundedMinutes).second(0).format('YYYY-MM-DD HH:mm');
        if (counter[key]) {
            const propValue = row[chartProperty];
            totals[propValue] = (totals[propValue] || 0) + 1;
            counter[key][propValue]++;
        }
    });
    const topValues = Object.entries(totals)
        .sort((a, b) => b.count - a.count)
        .map(([key]) => key);
    const data = Object.entries(counter)
        .map(([date, counts]) => Object.assign({name: date}, counts))
        .sort((a, b) => b.counts - a.counts);
    const keys = Object.keys(initialCounts);
    if (chartProperty === CODE_OPTION) {
        if (selectedErrorCode === TOP_10_ERROR_CODES) {
            const top10Errors = topValues.slice(0, 10);
            return {keys: keys.filter((key) => top10Errors.includes(key)), data};
        } else if (selectedErrorCode === TOP_20_ERROR_CODES) {
            const top20Errors = topValues.slice(0, 20);
            return {keys: keys.filter((key) => top20Errors.includes(key)), data};
        }
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

export const getPropValue = (item, property) => item && property ? (item[property] || '-') : '-';

export const traceHasError = (t) => {
    const tags = t.tags || [];
    const errorIdx = tags.findIndex(({key}) => key === 'error');
    const Error = errorIdx > -1 ? tags[errorIdx].value : '-';
    return Error === 'true';
};

export const getTraceCounts = (traces) => traces.reduce((acc, curr) => {
    if (traceHasError(curr)) {
        acc.errors++;
    }
    acc.total++;
    return acc;
}, {errors: 0, total: 0});

// eslint-disable-next-line complexity
export const mapTrace = (t) => {
    const tags = t.tags || [];
    const hasError = traceHasError(t);
    const result = {
        Service: getPropValue(t, 'serviceName'),
        Operation: getPropValue(t, 'operationName'),
        Error: String(hasError),
        'External Error Code': '-',
        'External Description': '-',
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
        result['External Error Code'] = getTagValue(tags, 'externalerrorcode');
        result['External Description'] = getTagValue(tags, 'externalerrordescription');
    }
    return result;
};

export const getTableData = (data, keys, onOpenTraceLog) => {
    const result = data
        .filter(({errorCode}) => keys.includes(`${errorCode}`))
        .map((row) => {
            const traces = row.traces || [];
            const clickHandler = () => onOpenTraceLog(row.traceId, row.recordedSessionUrl, traces.map(mapTrace));
            const traceCounts = getTraceCounts(traces);
            return {
                Created: row.timestamp ? moment(row.timestamp).format('YYYY-MM-DD HH:mm') : '-',
                Session: getPropValue(row, 'sessionId'),
                Trace: getPropValue(row, 'traceId'),
                Failure: getPropValue(row, 'failure'),
                'Intentional': getPropValue(row, 'isIntentional'),
                'Error Code': getPropValue(row, 'errorCode'),
                Site: getPropValue(row, 'site'),
                TPID: getPropValue(row, 'tpId'),
                EAPID: getPropValue(row, 'eapId'),
                'SiteID': getPropValue(row, 'siteId'),
                Category: getPropValue(row, 'category'),
                LoB: (LOB_LIST.find((l) => l.value === row.lineOfBusiness) || {label: '-'}).label,
                'Device User Agent ID': getPropValue(row, 'duaId'),
                Traces: (
                    <div
                        className="log-link"
                        role="button"
                        tabIndex={0}
                        onClick={clickHandler}
                        onKeyUp={clickHandler}
                    >
                        {`Open Log (${traceCounts.errors} error${traceCounts.errors === 1 ? '' : 's'})`}
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

export const getFilteredTraceData = (data, showOnlyErrors) => (
    (data.data || []).filter((row) => !showOnlyErrors || row.Error === 'true')
);