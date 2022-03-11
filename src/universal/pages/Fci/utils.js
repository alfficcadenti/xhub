import React from 'react';
import moment from 'moment';
import qs from 'query-string';
import {SVGIcon} from '@homeaway/react-svg';
import {EDIT__16} from '@homeaway/svg-defs';
import DataTable from '../../components/DataTable';
import {LOB_LIST} from '../../constants';
import {EXPEDIA_PARTNER_SERVICES_BRAND, EXPEDIA_BRAND, OPXHUB_SUPPORT_CHANNEL} from '../../constants';
import {formatToLocalDateTimeString, getOrDefault} from '../../utils';
import {validDateRange} from '../utils';
import {TRACE_TABLE_COLUMNS, SITES, CATEGORY_OPTION, FCI_TYPE_CHECKOUT, FCI_TYPE_LOGIN, CODE_OPTION, ALL_SITES} from './constants';


export const getInitialSelectData = (initialOption) => ({
    start: null,
    end: null,
    options: [{label: initialOption, value: initialOption}]
});

export const getBrandSites = (brand) => SITES[brand] || ['travel.chase.com'];

export const getIsSupportedBrand = (selectedBrands) => [EXPEDIA_PARTNER_SERVICES_BRAND, EXPEDIA_BRAND].includes(selectedBrands[0]);

export const getUnsupportedBrandMsg = (selectedBrands) => `FCIs for ${selectedBrands[0]} is not yet available. `
    + `For now only ${EXPEDIA_PARTNER_SERVICES_BRAND} and ${EXPEDIA_BRAND} is supported. `
    + `If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`;

// eslint-disable-next-line complexity
export const shouldFetchData = (prev, start, end, selectedSite, selectedLob, chartProperty, selectedErrorCode, hideIntentionalCheck, selectedErrorType) => (
    !prev.start
    || !prev.end
    || start.isBefore(prev.start)
    || start.minutes() !== 0 // Zooming always results in a start beginning at the top of the hour
    || end.isAfter(prev.end)
    || end.minutes() !== 59 // Zooming always results in a end finishing at the top of the hour
    || prev.selectedSite !== selectedSite
    || prev.selectedLob !== selectedLob
    || prev.chartProperty !== chartProperty
    || prev.selectedErrorCode !== selectedErrorCode
    || prev.hideIntentionalCheck !== hideIntentionalCheck
    || prev.selectedErrorType !== selectedErrorType
);

// eslint-disable-next-line complexity
export const getQueryValues = (search, brand = 'Expedia') => {
    const {
        tab, from, to, lobs, code, sites, hide_intentional: hideIntentional, search_id: searchId,
        bucket, id, deltaUsersId, type, chart_property: chartProperty
    } = qs.parse(search);
    const isValidDateRange = validDateRange(from, to);
    const fciType = [FCI_TYPE_CHECKOUT, FCI_TYPE_LOGIN].includes(type) ? type : FCI_TYPE_CHECKOUT;
    return {
        initialStart: isValidDateRange ? moment(from) : moment().subtract(24, 'hours').startOf('minute'),
        initialEnd: isValidDateRange ? moment(to) : moment(),
        initialTimeRange: isValidDateRange ? 'Custom' : 'Last 24 Hours',
        initialLobs: lobs
            ? lobs.split(',').map((l) => LOB_LIST.find(({value}) => value === l)).filter((l) => l)
            : [],
        initialSite: sites
            ? sites.split(',').filter((s) => s !== ALL_SITES)
            : [getBrandSites(brand)[0]],
        initialErrorCode: code ? code.split(',') : [],
        initialHideIntentionalCheck: hideIntentional === 'true',
        initialSearchId: searchId || '',
        initialDeltaUsersId: deltaUsersId || '',
        initialSelectedId: id || '',
        initialIndex: ['0', '1'].includes(tab) ? Number(tab) : 0,
        initialBucket: bucket && moment(bucket).isValid ? bucket : null,
        initialFciType: fciType,
        initialChartProperty: [CATEGORY_OPTION, CODE_OPTION].includes(chartProperty) ? chartProperty : CODE_OPTION
    };
};

export const stringifyQueryParams = (selectedValue) => Array.isArray(selectedValue) ? selectedValue.map((v) => v.value || v).join(',') : selectedValue;

export const getFciQueryString = (start, end, selectedErrorCode, selectedSite, selectedLob, hideIntentionalCheck, chartProperty) => {
    const dateQuery = `from=${start.toISOString()}&to=${end.toISOString()}`;
    const errorProperty = chartProperty === CATEGORY_OPTION ? 'category' : 'code';
    const errorQuery = selectedErrorCode?.length ? `&${errorProperty}=${stringifyQueryParams(selectedErrorCode)}` : '';
    const siteQuery = selectedSite?.length ? `&sites=${stringifyQueryParams(selectedSite)}` : '';
    const lobQuery = selectedLob?.length ? `&line_of_business=${stringifyQueryParams(selectedLob)}` : '';
    const hideIntentionalCheckQuery = `&hide_intentional=${hideIntentionalCheck}`;
    return `${dateQuery}${errorQuery}${siteQuery}${lobQuery}${hideIntentionalCheckQuery}`;
};

// eslint-disable-next-line complexity
export const getHistoryQueryString = (selectedBrands, start, end, selectedErrorCode, selectedSite,
    selectedLob, hideIntentionalCheck, chartProperty, searchId, activeIndex, selectedBucket, id, type) => {
    const brandQuery = `selectedBrand=${selectedBrands[0]}`;
    const dateQuery = `&from=${start.toISOString()}&to=${end.toISOString()}`;
    const errorProperty = chartProperty === CATEGORY_OPTION ? 'code' : 'code';
    const errorQuery = selectedErrorCode && selectedErrorCode.length ? `&${errorProperty}=${stringifyQueryParams(selectedErrorCode)}` : '';
    const siteQuery = selectedSite?.length ? `&sites=${stringifyQueryParams(selectedSite)}` : `&sites=${ALL_SITES}`;
    const lobQuery = selectedLob?.length ? `&line_of_business=${stringifyQueryParams(selectedLob)}` : '';
    const hideIntentionalCheckQuery = `&hide_intentional=${hideIntentionalCheck}`;
    const searchQuery = searchId ? `&search_id=${searchId}` : '';
    const indexQuery = `&tab=${activeIndex || 0}`;
    const bucketQuery = selectedBucket ? `&bucket=${selectedBucket}` : '';
    const idQuery = id ? `&id=${id}` : '';
    const errorTypeQuery = type ? `&type=${type}` : '';
    const chartPropertyQuery = chartProperty ? `&chart_property=${chartProperty}` : '';
    return `${brandQuery}${dateQuery}${errorQuery}${siteQuery}${hideIntentionalCheckQuery}`
        + `${lobQuery}${searchQuery}${indexQuery}${bucketQuery}${idQuery}${errorTypeQuery}`
        + `${chartPropertyQuery}`;
};

const getTagValue = (tags, property) => {
    const foundIdx = tags.findIndex(({key}) => (key || '').includes(property));
    if (foundIdx > -1) {
        return tags[foundIdx].value || '-';
    }
    return '-';
};

export const traceHasError = (t) => {
    const tags = t.trace_tag || [];
    const errorIdx = tags.findIndex(({key}) => key === 'error');
    const Error = errorIdx > -1 ? tags[errorIdx].value : '-';
    return Error === 'true';
};

export const getTraceCounts = (traces) => traces.reduce((acc, curr) => {
    if (curr.Error === 'true') {
        acc.errors++;
    }
    acc.total++;
    return acc;
}, {errors: 0, total: 0});

// eslint-disable-next-line complexity
export const mapTrace = (t) => {
    const tags = t.trace_tag || [];
    const hasError = traceHasError(t);
    const result = {
        Service: getOrDefault(t, 'service_name'),
        Operation: getOrDefault(t, 'operation_name'),
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

export const mapComment = (row) => ({
    Created: getOrDefault(row, 'timestamp'),
    Author: getOrDefault(row, 'author'),
    Comment: getOrDefault(row, 'comment'),
    'Is FCI': String(row.isFci)
});

export const mapFci = (row = {}, fciType) => {
    const rowCopy = JSON.parse(JSON.stringify(row));
    const fci = fciType === FCI_TYPE_CHECKOUT
        ? rowCopy?.fci
        : rowCopy?.login_failure;
    return {
        Created: getOrDefault(fci, 'timestamp', '-', formatToLocalDateTimeString),
        Session: getOrDefault(fci, 'session_id'),
        Trace: getOrDefault(fci, 'trace_id'),
        Failure: getOrDefault(fci, 'failure'),
        Intentional: getOrDefault(fci, 'is_intentional'),
        'Error Code': getOrDefault(fci, 'error_code'),
        Site: getOrDefault(fci, 'site'),
        LOB: getOrDefault(fci, 'lob'),
        TPID: getOrDefault(fci, 'tp_id'),
        EAPID: getOrDefault(fci, 'eap_id'),
        SiteID: getOrDefault(fci, 'site_id'),
        Source: getOrDefault(fci, 'source_name'),
        Message: getOrDefault(fci, 'message'),
        Category: getOrDefault(rowCopy, 'category', '-', (c) => c.join(',')),
        LoB: (LOB_LIST.find((l) => l.value === fci?.line_of_business) || {label: '-'}).label,
        'Device User Agent ID': getOrDefault(fci, 'dua_id'),
        'Error Name': getOrDefault(fci, 'error_name'),
        Comment: getOrDefault(fci, 'comment'),
        'Is FCI': typeof fci?.is_fci === 'boolean' ? String(fci.is_fci) : 'true',
        recordedSessionUrl: getOrDefault(row, 'recorded_session_url'),
        traces: getOrDefault(fci, 'traces', [], (t) => t.map(mapTrace))
    };
};

export const mapDeltaUser = (row = {}) => {
    return {
        Created: row.timestamp ? moment(row.timestamp).format('YYYY-MM-DD HH:mm') : '-',
        Brand: getOrDefault(row, 'brand'),
        LoB: (LOB_LIST.find((l) => l.value === row.lineOfBusiness) || {label: '-'}).label,
        'Funnel Step': getOrDefault(row, 'metricName'),
    };
};

export const getTableData = (data, onOpenEdit, fciType) => {
    const result = data
        .map((row) => {
            const fci = mapFci(row, fciType);
            const editClickHandler = () => onOpenEdit(fci);
            const traceCounts = getTraceCounts(fci.traces);
            fci.Traces = (
                <div
                    className="modal-link"
                    role="button"
                    tabIndex={0}
                    onClick={editClickHandler}
                    onKeyUp={editClickHandler}
                >
                    {`Open Log (${traceCounts.errors} error${traceCounts.errors === 1 ? '' : 's'})`}
                </div>
            );
            fci.Edit = (
                <div
                    className="modal-link"
                    role="button"
                    tabIndex={0}
                    onClick={editClickHandler}
                    onKeyUp={editClickHandler}
                >
                    <SVGIcon usefill markup={EDIT__16} />
                </div>
            );
            return fci;
        });
    result.sort((a, b) => b.Created.localeCompare(a.Created));
    return result;
};

export const getFilteredTraceData = (data) => (
    (data || []).filter(({Error}) => Error === 'true')
);

export const getDeltaUserTableData = (data) => {
    if (data && data?.length) {
        const result = data
            .map((row) => mapDeltaUser(row));
        result.sort((a, b) => b.Created.localeCompare(a.Created));
        return result;
    }
    return [];
};

export const getBaseUrl = (fciType) => (
    (fciType === FCI_TYPE_LOGIN)
        ? '/v1/login-failures'
        : '/v1/checkout-failures'
);

export const getSearchUrl = (fciType, searchText) => `${getBaseUrl(fciType)}/search?id=${searchText}`;

export const getDeltaUserUrl = (start, end, brand, sessionId) => (
    `/v1/delta-user-by-session-id?from=${start}&to=${end}&brand=${brand}&session_id=${sessionId}`
);

export const getFciCountsUrl = (fciType, start, end, selectedErrorCode, selectedSite, selectedLob, hideIntentionalCheck, chartProperty) => {
    const fciQuery = getFciQueryString(start, end, selectedErrorCode, selectedSite, selectedLob, hideIntentionalCheck, chartProperty);
    const url = chartProperty === CATEGORY_OPTION
        ? `${getBaseUrl(fciType)}/category-counts?${fciQuery}`
        : `${getBaseUrl(fciType)}/error-counts?${fciQuery}`;
    return url;
};

export const getFciDetailsUrl = (fciType, start, end, selectedErrorCode, selectedSite, selectedLob, hideIntentionalCheck, chartProperty) => {
    const fciQuery = getFciQueryString(start, end, selectedErrorCode, selectedSite, selectedLob, hideIntentionalCheck, chartProperty);
    return `${getBaseUrl(fciType)}?${fciQuery}`;
};

export const getFciSitesUrl = (fciType, start, end) => {
    return `${getBaseUrl(fciType)}/sites?from=${start}&to=${end}`;
};

export const getFciLobsUrl = (fciType, start, end, site) => {
    const siteQuery = site ? `&sites=${site.join(',')}` : '';
    return `${getBaseUrl(fciType)}/lob?from=${start}&to=${end}${siteQuery}`;
};

export const getFciErrorCodesUrl = (fciType, start, end, chartProperty) => {
    const path = chartProperty === CODE_OPTION
        ? `${getBaseUrl(fciType)}/error-codes`
        : `${getBaseUrl(fciType)}/error-categories`;
    return `${path}?from=${start}&to=${end}`;
};
