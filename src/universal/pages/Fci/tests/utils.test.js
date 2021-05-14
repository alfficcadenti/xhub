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
    getPropValue,
    traceHasError,
    getTraceCounts,
    mapTrace,
    mapComment,
    mapFci,
    getFilteredTraceData
} from '../utils';
import {SITES, CATEGORY_OPTION} from '../constants';
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
        const chartProperty = 'categoryA';
        const selectedErrorCode = '201';
        expect(shouldFetchData({}, moment('2020-01-01'))).to.be.eql(true);
        expect(shouldFetchData({start}, moment('2020-01-01'))).to.be.eql(true);
        expect(shouldFetchData({start, end}, moment('2020-01-01'))).to.be.eql(true);
        expect(shouldFetchData({start, end, selectedSite},
            moment('2020-01-01'))).to.be.eql(true);
        expect(shouldFetchData({start, end, selectedSite},
            moment('2020-01-03'), moment('2020-01-05'))).to.be.eql(true);
        expect(shouldFetchData({start, end, selectedSite, chartProperty},
            moment('2020-01-03'), moment('2020-01-03'), 'www.expedia.com', 'categoryB')).to.be.eql(true);
        expect(shouldFetchData({start, end, selectedSite, chartProperty, selectedErrorCode},
            moment('2020-01-03'), moment('2020-01-03'), 'www.expedia.com', 'categoryA')).to.be.eql(true);
        expect(shouldFetchData({start, end, selectedSite, chartProperty, selectedErrorCode},
            moment('2020-01-03'), moment('2020-01-03'), 'www.expedia.com', 'categoryA', '201')).to.be.eql(false);
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
            + `&siteName=${site}&selectedBrand=${urlBrand}&hideIntentional=${intentional}`
            + `&searchId=${searchId}&tab=${index}&id=${id}&bucket=${bucket}`, EXPEDIA_PARTNER_SERVICES_BRAND);
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
        expect(getFciQueryString(start, end, null, null, hideIntentionalCheck, null)).to.eql(
            `from=${start.toISOString()}&to=${end.toISOString()}&hideIntentional=${hideIntentionalCheck}`
        );
    });

    it('getFciQueryString - custom', () => {
        const start = moment().subtract(1, 'day');
        const end = moment();
        const selectedErrorCode = '404';
        const selectedSite = 'www.expedia.com';
        const hideIntentionalCheck = false;
        const chartProperty = CATEGORY_OPTION;
        expect(getFciQueryString(start, end, selectedErrorCode, selectedSite, hideIntentionalCheck, chartProperty)).to.eql(
            `from=${start.toISOString()}&to=${end.toISOString()}&category=${selectedErrorCode}`
            + `&siteName=${selectedSite}&hideIntentional=${hideIntentionalCheck}`
        );
    });

    it('getHistoryQueryString - default', () => {
        const selectedBrands = [EXPEDIA_PARTNER_SERVICES_BRAND];
        const start = moment().subtract(1, 'day');
        const end = moment();
        const hideIntentionalCheck = false;
        const activeIndex = 0;
        expect(getHistoryQueryString(selectedBrands, start, end, null, null,
            hideIntentionalCheck, null, null, activeIndex)).to.eql(
            `selectedBrand=${selectedBrands[0]}&from=${start.toISOString()}&to=${end.toISOString()}`
            + `&hideIntentional=${hideIntentionalCheck}&tab=${activeIndex}`
        );
    });

    it('getHistoryQueryString - custom', () => {
        const selectedBrands = [EXPEDIA_PARTNER_SERVICES_BRAND];
        const start = moment().subtract(1, 'day');
        const end = moment();
        const selectedErrorCode = '404';
        const selectedSite = 'www.expedia.com';
        const hideIntentionalCheck = false;
        const chartProperty = CATEGORY_OPTION;
        const searchId = 'traceidA';
        const selectedBucket = '2020-01-02';
        const id = 'traceidA';
        const activeIndex = 0;
        expect(getHistoryQueryString(selectedBrands, start, end, selectedErrorCode, selectedSite,
            hideIntentionalCheck, chartProperty, searchId, activeIndex, selectedBucket, id)).to.eql(
            `selectedBrand=${selectedBrands[0]}&from=${start.toISOString()}&to=${end.toISOString()}`
            + `&code=${selectedErrorCode}&siteName=${selectedSite}`
            + `&hideIntentional=${hideIntentionalCheck}&searchId=${searchId}&tab=${activeIndex}`
            + `&bucket=${selectedBucket}&id=${id}`
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

    it('getPropValue', () => {
        const item = {a: 'aa', b: 'bb'};
        expect(getPropValue(item, 'a')).to.equal('aa');
        expect(getPropValue(item, 'b')).to.equal('bb');
        expect(getPropValue(item, 'c')).to.equal('-');
        expect(getPropValue(null, 'a')).to.equal('-');
        expect(getPropValue(item, null)).to.equal('-');
    });

    it('traceHasError - false', () => {
        const trace = {
            tags: [{key: 'error', value: 'false'}]
        };
        expect(traceHasError(trace)).to.equal(false);
        expect(traceHasError({})).to.equal(false);
    });

    it('traceHasError - true', () => {
        const trace = {
            tags: [{key: 'error', value: 'true'}]
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
            serviceName: 'Service Name',
            operationName: 'Operation Name',
            traces: []
        };
        const trace = mapTrace(data);
        expect(trace.Service).to.eql(data.serviceName);
        expect(trace.Operation).to.eql(data.operationName);
        expect(trace.Error).to.eql('false');
        expect(trace['External Error Code']).to.eql('-');
        expect(trace['External Description']).to.eql('-');
        expect(trace.traces).to.eql(data.traces);
    });

    it('mapTrace - has error', () => {
        const extErrorCode = '502';
        const extErrorDescription = 'Error Description';
        const data = {
            serviceName: 'Service Name',
            operationName: 'Operation Name',
            tags: [
                {key: 'error', value: 'true'},
                {key: 'externalerrorcode_1_1', value: extErrorCode},
                {key: 'externalerrordescription_1_1', value: extErrorDescription}
            ],
            traces: [
                {serviceName: 'Service Name', operationName: 'Operation Name', tags: [], traces: []}
            ]
        };
        const trace = mapTrace(data);
        expect(trace.Service).to.eql(data.serviceName);
        expect(trace.Operation).to.eql(data.operationName);
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

    it('mapFci', () => {
        const row = {
            fci: {
                timestamp: '2021-01-15T16:36:00.000Z',
                sessionId: 'sessionId',
                traceId: 'traceId',
                failure: 'failure',
                isIntentional: 'true',
                errorCode: 'errorCode',
                site: 'site',
                tpId: 'tpId',
                eapId: 'eapId',
                siteId: 'siteId',
                lineOfBusiness: 'F',
                duaId: 'duaId',
                comment: 'comment',
                isFci: true
            },
            category: ['category'],
            recordedSessionUrl: 'recordedSessionUrl'
        };
        const {fci, category, recordedSessionUrl} = row;
        expect(mapFci(row)).to.eql({
            Created: moment(fci.timestamp).format('YYYY-MM-DD HH:mm'),
            Session: fci.sessionId,
            Trace: fci.traceId,
            Failure: fci.failure,
            Intentional: fci.isIntentional,
            'Error Code': fci.errorCode,
            Site: fci.site,
            TPID: fci.tpId,
            EAPID: fci.eapId,
            'SiteID': fci.siteId,
            Category: category.join(', '),
            LoB: 'Flights',
            'Device User Agent ID': fci.duaId,
            Comment: fci.comment,
            'Is FCI': String(fci.isFci),
            recordedSessionUrl,
            traces: []
        });
    });

    it('mapFci - null values', () => {
        const BLANK = '-';
        expect(mapFci()).to.eql({
            Created: BLANK,
            Session: BLANK,
            Trace: BLANK,
            Failure: BLANK,
            Intentional: BLANK,
            'Error Code': BLANK,
            Site: BLANK,
            TPID: BLANK,
            EAPID: BLANK,
            'SiteID': BLANK,
            Category: BLANK,
            LoB: BLANK,
            'Device User Agent ID': BLANK,
            Comment: BLANK,
            'Is FCI': 'undefined',
            recordedSessionUrl: BLANK,
            traces: [],
        });
    });
});
