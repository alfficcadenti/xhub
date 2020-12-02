import moment from 'moment';
import {expect} from 'chai';
import {validDateRange, getQueryValues, getLineChartData, getErrorCodes, getPropValue, traceHasError, getTraceCounts, mapTrace, getFilteredTraceData} from '../utils';
import {ALL_ERROR_CODES, TOP_10_ERROR_CODES, TOP_20_ERROR_CODES, CODE_OPTION, CATEGORY_OPTION} from '../constants';

describe('Fci Utils', () => {
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
        expect(result.initialTimeRange).to.be.eql('Last 1 Hour');
        expect(result.initialLobs).to.be.eql([]);
        expect(result.initialErrorCode).to.be.eql(TOP_20_ERROR_CODES);
        expect(result.initialSite).to.be.eql('travel.chase.com');
    });

    it('getQueryValues - custom', () => {
        const start = '2020-01-01';
        const end = '2020-02-02';
        const lob = 'H';
        const errorCode = '500';
        const site = 'travel.rbcrewards.com';
        const result = getQueryValues(`?from=${start}&to=${end}&lobs=${lob}&errorCode=${errorCode}&siteName=${site}`);
        expect(result.initialStart.isSame(start, 'day')).to.be.eql(true);
        expect(result.initialEnd.isSame(end, 'day')).to.be.eql(true);
        expect(result.initialTimeRange).to.be.eql('Custom');
        expect(result.initialLobs[0].value).to.be.eql(lob);
        expect(result.initialErrorCode).to.be.eql(errorCode);
        expect(result.initialSite).to.be.eql(site);
    });

    it('getLineChartData - errorCode', () => {
        expect(getLineChartData(moment('2020-01-01T12:00:000Z'), moment('2020-01-01T12:59:000Z'), [{errorCode: 400}, {errorCode: 401}], ALL_ERROR_CODES, CODE_OPTION).keys)
            .to.be.eql(['400', '401']);
    });

    it('getLineChartData - category', () => {
        expect(getLineChartData(moment('2020-01-01T12:00:000Z'), moment('2020-01-01T12:59:000Z'), [{category: ['a']}, {category: ['b']}], ALL_ERROR_CODES, CATEGORY_OPTION).keys)
            .to.be.eql(['a', 'b']);
    });

    it('getErrorCodes', () => {
        expect(getErrorCodes([{errorCode: 400}, {errorCode: 401}]))
            .to.be.eql([ALL_ERROR_CODES, TOP_10_ERROR_CODES, TOP_20_ERROR_CODES, '400', '401']);
    });

    it('getFilteredTraceData', () => {
        const data = {
            data: [
                {Error: 'true', Operation: 'A'},
                {Error: 'false', Operation: 'B'}
            ]
        };
        const errorLogs = getFilteredTraceData(data, true);
        expect(errorLogs).to.eql([
            {Error: 'true', Operation: 'A'}
        ]);
        const allLogs = getFilteredTraceData(data, false);
        expect(allLogs).to.eql([
            {Error: 'true', Operation: 'A'},
            {Error: 'false', Operation: 'B'}
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
            {tags: [{key: 'error', value: 'true'}]},
            {tags: [{key: 'error', value: 'false'}]},
            {tags: [{key: 'error', value: 'false'}]}
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
});
