import moment from 'moment';
import {expect} from 'chai';
import {
    getBrandSites,
    getIsSupportedBrand,
    getUnsupportedBrandMsg,
    shouldFetchData,
    stringifyQueryParams,
    getQueryValues,
    getFciQueryString,
    getHistoryQueryString,
    traceHasError,
    getTraceCounts,
    mapTrace,
    mapComment,
    mapFci,
    getFilteredTraceData
} from '../utils';
import {SITES, CATEGORY_OPTION, FCI_TYPE_CHECKOUT, FCI_TYPE_LOGIN} from '../constants';
import {EXPEDIA_BRAND, VRBO_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND, OPXHUB_SUPPORT_CHANNEL} from '../../../constants';

describe('Fci Utils', () => {
    it('getBrandSites - returns list of sites per Expedia Partner Solution', () => {
        const brandSites = getBrandSites(EXPEDIA_PARTNER_SERVICES_BRAND);
        expect(brandSites).to.eql(SITES[EXPEDIA_PARTNER_SERVICES_BRAND]);
    });

    it('getBrandSites - returns array with travel.chase.com as per API fallback if input is missing or not a brand', () => {
        const brandSites = getBrandSites();
        expect(brandSites).to.eql(['travel.chase.com']);
    });

    it('getIsSupportedBrand', () => {
        expect(getIsSupportedBrand([EXPEDIA_BRAND])).to.eql(true);
        expect(getIsSupportedBrand([EXPEDIA_PARTNER_SERVICES_BRAND])).to.eql(true);
        expect(getIsSupportedBrand([VRBO_BRAND])).to.eql(false);
    });

    it('getUnsupportedBrandMsg', () => {
        expect(getUnsupportedBrandMsg([EXPEDIA_BRAND])).to.eql(`FCIs for ${EXPEDIA_BRAND} is not yet available. `
            + `For now only ${EXPEDIA_PARTNER_SERVICES_BRAND} and ${EXPEDIA_BRAND} is supported. `
            + `If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`);
    });

    it('shouldFetchData', () => {
        const start = moment('2020-01-02');
        const end = moment('2020-01-04');
        const selectedSite = 'www.expedia.com';
        const selectedLob = 'Cars';
        const chartProperty = 'categoryA';
        const selectedErrorCode = '201';
        expect(shouldFetchData({}, moment('2020-01-01'))).to.be.eql(true);
        expect(shouldFetchData({start}, moment('2020-01-01'))).to.be.eql(true);
        expect(shouldFetchData({start, end}, moment('2020-01-01'))).to.be.eql(true);
        expect(shouldFetchData({start, end, selectedSite, selectedLob},
            moment('2020-01-01'))).to.be.eql(true);
        expect(shouldFetchData({start, end, selectedSite, selectedLob},
            moment('2020-01-03'), moment('2020-01-05'))).to.be.eql(true);
        expect(shouldFetchData({start, end, selectedSite, selectedLob},
            moment('2020-01-03'), moment('2020-01-03'), 'www.expedia.com', 'Flights')).to.be.eql(true);
        expect(shouldFetchData({start, end, selectedSite, selectedLob, chartProperty},
            moment('2020-01-03'), moment('2020-01-03'), 'www.expedia.com', 'Cars', 'categoryB')).to.be.eql(true);
        expect(shouldFetchData({start, end, selectedSite, selectedLob, chartProperty, selectedErrorCode},
            moment('2020-01-03'), moment('2020-01-03'), 'www.expedia.com', 'Cars', 'categoryA')).to.be.eql(true);
        expect(shouldFetchData({start, end, selectedSite, selectedLob, chartProperty, selectedErrorCode},
            moment('2020-01-03'), moment('2020-01-03'), 'www.expedia.com', 'Cars', 'categoryA', '201')).to.be.eql(true);
        expect(shouldFetchData({start, end, selectedSite, selectedLob, chartProperty, selectedErrorCode},
            moment('2020-01-03'), moment('2020-01-03').endOf('hour'), 'www.expedia.com', 'Cars', 'categoryA', '201')).to.be.eql(false);
    });

    it('stringifyQueryParams', () => {
        expect(stringifyQueryParams([{value: 'a'}, {value: 'b'}, {value: 'c'}])).to.be.eql('a,b,c');
        expect(stringifyQueryParams('abc')).to.be.eql('abc');
    });

    it('getQueryValues - default', () => {
        const result = getQueryValues();
        expect(result.initialTimeRange).to.be.eql('Last 24 Hours');
        expect(result.initialLobs).to.be.eql([]);
        expect(result.initialSite).to.be.eql([getBrandSites('Expedia')[0]]);
        expect(result.initialErrorCode).to.be.eql([]);
        expect(result.initialHideIntentionalCheck).to.be.eql(false);
        expect(result.initialSearchId).to.be.eql('');
        expect(result.initialSelectedId).to.be.eql('');
        expect(result.initialIndex).to.be.eql(0);
        expect(result.initialBucket).to.be.eql(null);
    });

    it('getQueryValues - custom', () => {
        const start = '2020-01-01';
        const end = '2020-02-02';
        const lob = 'H';
        const errorCode = '500';
        const site = 'travel.chase.com';
        const urlBrand = 'Expedia';
        const intentional = true;
        const index = 1;
        const searchId = 'traceidA';
        const id = 'traceidB';
        const bucket = '2020-01-01';
        const result = getQueryValues(`?from=${start}&to=${end}&lobs=${lob}&code=${errorCode}`
            + `&sites=${site}&selectedBrand=${urlBrand}&hide_intentional=${intentional}`
            + `&search_id=${searchId}&tab=${index}&id=${id}&bucket=${bucket}`, EXPEDIA_PARTNER_SERVICES_BRAND);
        expect(result.initialStart.isSame(start, 'day')).to.be.eql(true);
        expect(result.initialEnd.isSame(end, 'day')).to.be.eql(true);
        expect(result.initialTimeRange).to.be.eql('Custom');
        expect(result.initialLobs[0].value).to.be.eql(lob);
        expect(result.initialErrorCode).to.be.eql([errorCode]);
        expect(result.initialSite).to.be.eql([site]);
        expect(result.initialHideIntentionalCheck).to.be.eql(intentional);
        expect(result.initialSearchId).to.be.eql(searchId);
        expect(result.initialSelectedId).to.be.eql(id);
        expect(result.initialIndex).to.be.eql(Number(index));
        expect(result.initialBucket).to.be.eql(bucket);
    });

    it('getFciQueryString - default', () => {
        const start = moment().subtract(1, 'day');
        const end = moment();
        const hideIntentionalCheck = false;
        expect(getFciQueryString(start, end, null, null, null, hideIntentionalCheck, null)).to.eql(
            `from=${start.toISOString()}&to=${end.toISOString()}&hide_intentional=${hideIntentionalCheck}`
        );
    });

    it('getFciQueryString - custom', () => {
        const start = moment().subtract(1, 'day');
        const end = moment();
        const selectedErrorCode = '404';
        const selectedSite = 'www.expedia.com';
        const selectedLob = 'Car';
        const hideIntentionalCheck = false;
        const chartProperty = CATEGORY_OPTION;
        expect(getFciQueryString(start, end, selectedErrorCode, selectedSite, selectedLob, hideIntentionalCheck, chartProperty)).to.eql(
            `from=${start.toISOString()}&to=${end.toISOString()}&category=${selectedErrorCode}`
            + `&sites=${selectedSite}&line_of_business=${selectedLob}&hide_intentional=${hideIntentionalCheck}`
        );
    });

    it('getHistoryQueryString - default', () => {
        const selectedBrands = [EXPEDIA_PARTNER_SERVICES_BRAND];
        const start = moment().subtract(1, 'day');
        const end = moment();
        const hideIntentionalCheck = false;
        const activeIndex = 0;
        expect(getHistoryQueryString(selectedBrands, start, end, null, null, null,
            hideIntentionalCheck, null, null, activeIndex)).to.eql(
            `selectedBrand=${selectedBrands[0]}&from=${start.toISOString()}&to=${end.toISOString()}`
            + `&sites=All Sites&hide_intentional=${hideIntentionalCheck}&tab=${activeIndex}`
        );
    });

    it('getHistoryQueryString - custom', () => {
        const selectedBrands = [EXPEDIA_PARTNER_SERVICES_BRAND];
        const start = moment().subtract(1, 'day');
        const end = moment();
        const selectedErrorCode = '404';
        const selectedSite = 'www.expedia.com';
        const hideIntentionalCheck = false;
        const lobs = [];
        const chartProperty = CATEGORY_OPTION;
        const searchId = 'traceidA';
        const selectedBucket = '2020-01-02';
        const id = 'traceidA';
        const activeIndex = 0;
        expect(getHistoryQueryString(selectedBrands, start, end, selectedErrorCode, selectedSite,
            lobs, hideIntentionalCheck, chartProperty, searchId, activeIndex, selectedBucket, id, FCI_TYPE_LOGIN)).to.eql(
            `selectedBrand=${selectedBrands[0]}&from=${start.toISOString()}&to=${end.toISOString()}`
            + `&code=${selectedErrorCode}&sites=${selectedSite}`
            + `&hide_intentional=${hideIntentionalCheck}&search_id=${searchId}&tab=${activeIndex}`
            + `&bucket=${selectedBucket}&id=${id}&type=${FCI_TYPE_LOGIN}&chart_property=${chartProperty}`
        );
    });

    it('getFilteredTraceData', () => {
        const data = [
            {Error: 'true', Operation: 'A'},
            {Error: 'false', Operation: 'B'}
        ];
        const errorLogs = getFilteredTraceData(data);
        expect(errorLogs).to.eql([
            {Error: 'true', Operation: 'A'}
        ]);
    });

    it('traceHasError - false', () => {
        const trace = {
            trace_tag: [{key: 'error', value: 'false'}]
        };
        expect(traceHasError(trace)).to.equal(false);
        expect(traceHasError({})).to.equal(false);
    });

    it('traceHasError - true', () => {
        const trace = {
            trace_tag: [{key: 'error', value: 'true'}]
        };
        expect(traceHasError(trace)).to.equal(true);
    });

    it('getTraceCounts', () => {
        const traces = [
            {Error: 'true'},
            {Error: 'false'},
            {Error: 'false'}
        ];

        const result = getTraceCounts(traces);
        expect(result.total).to.equal(3);
        expect(result.errors).to.equal(1);
    });

    it('mapTrace - no error', () => {
        const data = {
            service_name: 'Service Name',
            operation_name: 'Operation Name',
            traces: []
        };
        const trace = mapTrace(data);
        expect(trace.Service).to.eql(data.service_name);
        expect(trace.Operation).to.eql(data.operation_name);
        expect(trace.Error).to.eql('false');
        expect(trace['External Error Code']).to.eql('-');
        expect(trace['External Description']).to.eql('-');
        expect(trace.traces).to.eql(data.traces);
    });

    it('mapTrace - has error', () => {
        const extErrorCode = '502';
        const extErrorDescription = 'Error Description';
        const data = {
            service_name: 'Service Name',
            operation_name: 'Operation Name',
            trace_tag: [
                {key: 'error', value: 'true'},
                {key: 'externalerrorcode_1_1', value: extErrorCode},
                {key: 'externalerrordescription_1_1', value: extErrorDescription}
            ],
            traces: [
                {service_name: 'Service Name', operationn_ame: 'Operation Name', trace_tag: [], traces: []}
            ]
        };
        const trace = mapTrace(data);
        expect(trace.Service).to.eql(data.service_name);
        expect(trace.Operation).to.eql(data.operation_name);
        expect(trace.Error).to.eql('true');
        expect(trace['External Error Code']).to.eql(extErrorCode);
        expect(trace['External Description']).to.eql(extErrorDescription);
        expect(trace.traces).to.eql(data.traces);
    });

    it('mapComment', () => {
        const row = {
            traceId: 'traceId',
            timestamp: '2021-01-15T16:36:00.000Z',
            author: 'author',
            comment: 'comment',
            isFci: false
        };
        expect(mapComment(row)).to.eql({
            Created: '2021-01-15T16:36:00.000Z',
            Author: row.author,
            Comment: row.comment,
            'Is FCI': String(row.isFci)
        });
    });

    it('mapComment - null values', () => {
        const BLANK = '-';
        expect(mapComment({})).to.eql({
            Created: BLANK,
            Author: BLANK,
            Comment: BLANK,
            'Is FCI': 'undefined'
        });
    });

    it('mapFci - checkout', () => {
        const row = {
            fci: {
                timestamp: '2021-01-15T16:36:00.000Z',
                session_id: 'sessionId',
                trace_id: 'traceId',
                failure: 'failure',
                is_intentional: 'true',
                error_code: 'errorCode',
                site: 'site',
                tp_id: 'tpId',
                eap_id: 'eapId',
                site_id: 'siteId',
                lob: 'lob',
                line_of_business: 'F',
                dua_id: 'duaId',
                comment: 'comment',
                is_fci: true,
                message: 'message',
                source_name: 'source'
            },
            category: ['category'],
            recorded_session_url: 'recordedSessionUrl'
        };
        const {fci, category, recorded_session_url: recordedSessionUrl} = row;
        expect(mapFci(row, FCI_TYPE_CHECKOUT)).to.eql({
            Created: moment(fci.timestamp).format('YYYY-MM-DD HH:mm'),
            Session: fci.session_id,
            Trace: fci.trace_id,
            Failure: fci.failure,
            Intentional: fci.is_intentional,
            'Error Code': fci.error_code,
            Site: fci.site,
            LOB: fci.lob,
            TPID: fci.tp_id,
            EAPID: fci.eap_id,
            Message: fci.message,
            Source: fci.source_name,
            'SiteID': fci.site_id,
            Category: category.join(', '),
            LoB: 'Flights',
            'Device User Agent ID': fci.dua_id,
            'Error Name': '-',
            Comment: fci.comment,
            'Is FCI': String(fci.is_fci),
            recordedSessionUrl,
            traces: []
        });
    });


    it('mapFci - login', () => {
        const row = {
            login_failure: {
                timestamp: '2021-01-15T16:36:00.000Z',
                session_id: 'sessionId',
                trace_id: 'traceId',
                failure: 'failure',
                is_intentional: 'true',
                error_code: 'errorCode',
                site: 'site',
                tp_id: 'tpId',
                eap_id: 'eapId',
                site_id: 'siteId',
                lob: 'lob',
                line_of_business: 'F',
                dua_id: 'duaId',
                comment: 'comment',
                is_fci: true,
                message: 'message',
                source_name: 'source',
                error_name: 'error name'
            },
            category: ['category'],
            recorded_session_url: 'recordedSessionUrl'
        };
        const {login_failure: fci, category, recorded_session_url: recordedSessionUrl} = row;
        expect(mapFci(row, FCI_TYPE_LOGIN)).to.eql({
            Created: moment(fci.timestamp).format('YYYY-MM-DD HH:mm'),
            Session: fci.session_id,
            Trace: fci.trace_id,
            Failure: fci.failure,
            Intentional: fci.is_intentional,
            'Error Code': fci.error_code,
            Site: fci.site,
            LOB: fci.lob,
            TPID: fci.tp_id,
            EAPID: fci.eap_id,
            Message: fci.message,
            Source: fci.source_name,
            'SiteID': fci.site_id,
            Category: category.join(', '),
            LoB: 'Flights',
            'Device User Agent ID': fci.dua_id,
            'Error Name': fci.error_name,
            Comment: fci.comment,
            'Is FCI': String(fci.is_fci),
            recordedSessionUrl,
            traces: []
        });
    });

    it('mapFci - null values', () => {
        const BLANK = '-';
        expect(mapFci(null, FCI_TYPE_CHECKOUT)).to.eql({
            Created: BLANK,
            Session: BLANK,
            Trace: BLANK,
            Failure: BLANK,
            Intentional: BLANK,
            'Error Code': BLANK,
            Site: BLANK,
            LOB: BLANK,
            LoB: BLANK,
            Message: BLANK,
            Source: BLANK,
            TPID: BLANK,
            EAPID: BLANK,
            'SiteID': BLANK,
            Category: BLANK,
            'Device User Agent ID': BLANK,
            'Error Name': BLANK,
            Comment: BLANK,
            'Is FCI': 'true',
            recordedSessionUrl: BLANK,
            traces: [],
        });
    });
});
