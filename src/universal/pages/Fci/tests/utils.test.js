import moment from 'moment';
import {expect} from 'chai';
import {
    shouldFetchData,
    validDateRange,
    getQueryValues,
    getPropValue,
    traceHasError,
    getTraceCounts,
    mapTrace,
    mapComment,
    mapFci,
    getFilteredTraceData,
    getBrandSites
} from '../utils';
import {SITES} from '../constants';
import {EXPEDIA_PARTNER_SERVICES_BRAND} from '../../../constants';

describe('Fci Utils', () => {
    // shouldFetchData = (prev, start, end, selectedSite, chartProperty, selectedErrorCode)
    it('shouldFetchData', () => {
        expect(shouldFetchData({})).to.be.eql(true);
        expect(shouldFetchData({start: '2020-01-02'})).to.be.eql(true);
        expect(shouldFetchData({start: '2020-01-02', end: '2020-01-04'})).to.be.eql(true);
        expect(shouldFetchData({start: '2020-01-02', end: '2020-01-04', selectedSite: 'www.expedia.com'},
            moment('2020-01-01'))).to.be.eql(true);
        expect(shouldFetchData({start: '2020-01-02', end: '2020-01-04', selectedSite: 'www.expedia.com'},
            moment('2020-01-03'), moment('2020-01-05'))).to.be.eql(true);
        expect(shouldFetchData({start: '2020-01-02', end: '2020-01-04', selectedSite: 'www.expedia.com', chartProperty: 'categoryA'},
            moment('2020-01-03'), moment('2020-01-03'), 'www.expedia.com', 'categoryB')).to.be.eql(true);
        expect(shouldFetchData({start: '2020-01-02', end: '2020-01-04', selectedSite: 'www.expedia.com', chartProperty: 'categoryA', selectedErrorCode: '201'},
            moment('2020-01-03'), moment('2020-01-03'), 'www.expedia.com', 'categoryA')).to.be.eql(true);
        expect(shouldFetchData({start: '2020-01-02', end: '2020-01-04', selectedSite: 'www.expedia.com', chartProperty: 'categoryA', selectedErrorCode: '201'},
            moment('2020-01-03'), moment('2020-01-03'), 'www.expedia.com', 'categoryA', '201')).to.be.eql(false);
    });

    it('validDateRange - invalid dates', () => {
        expect(validDateRange(null, null)).to.be.eql(false);
        expect(validDateRange('2020-01-01', null)).to.be.eql(false);
        expect(validDateRange(null, '2020-02-02')).to.be.eql(false);
        expect(validDateRange('abc', '2020-02-02')).to.be.eql(false);
        expect(validDateRange('2020-01-01', 'abc')).to.be.eql(false);
        expect(validDateRange('2020-02-02', '2020-01-01')).to.be.eql(false);
    });

    it('validDateRange - valid', () => {
        expect(validDateRange('2020-01-01', '2020-02-02')).to.be.eql(true);
    });

    it('getQueryValues - default', () => {
        const result = getQueryValues();
        expect(result.initialTimeRange).to.be.eql('Last 24 Hours');
        expect(result.initialLobs).to.be.eql([]);
        expect(result.initialSite).to.be.eql(getBrandSites('Expedia')[0]);
        expect(result.initialErrorCode).to.be.eql('');
        expect(result.initialHideIntentionalCheck).to.be.eql(false);
    });

    it('getQueryValues - custom', () => {
        const start = '2020-01-01';
        const end = '2020-02-02';
        const lob = 'H';
        const errorCode = '500';
        const site = 'travel.chase.com';
        const urlBrand = 'Expedia';
        const intentional = true;
        const result = getQueryValues(`?from=${start}&to=${end}&lobs=${lob}&code=${errorCode}&siteName=${site}&selectedBrand=${urlBrand}&hideIntentional=${intentional}`, EXPEDIA_PARTNER_SERVICES_BRAND);
        expect(result.initialStart.isSame(start, 'day')).to.be.eql(true);
        expect(result.initialEnd.isSame(end, 'day')).to.be.eql(true);
        expect(result.initialTimeRange).to.be.eql('Custom');
        expect(result.initialLobs[0].value).to.be.eql(lob);
        expect(result.initialErrorCode).to.be.eql(errorCode);
        expect(result.initialSite).to.be.eql(site);
        expect(result.initialHideIntentionalCheck).to.be.eql(intentional);
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
            tags: [{key: 'externalerrorcode_1_1', value: 'none'}],
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

    it('getBrandSites - returns list of sites per Expedia Partner Solution', () => {
        const brandSites = getBrandSites(EXPEDIA_PARTNER_SERVICES_BRAND);
        expect(brandSites).to.eql(SITES[EXPEDIA_PARTNER_SERVICES_BRAND]);
    });

    it('getBrandSites - returns array with travel.chase.com as per API fallback if input is missing or not a brand', () => {
        const brandSites = getBrandSites();
        expect(brandSites).to.eql(['travel.chase.com']);
    });
});
