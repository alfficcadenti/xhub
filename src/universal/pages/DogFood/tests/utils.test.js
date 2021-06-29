import moment from 'moment';
import {expect} from 'chai';
import {
    getQueryValues,
    mapActiveIndexToTabName,
    getActiveIndex
} from '../utils';
import {
    ALL_STATUSES_OPTION,
    ALL_PROJECTS_OPTION
} from '../../../constants';
// import {mockIssues} from './mockIssue';

describe('Dog Food Utils', () => {
    it('getQueryValues - default', () => {
        const start = moment().subtract(1, 'month').startOf('minute').format('YYYY-MM-DD');
        const end = moment().format('YYYY-MM-DD');
        const result = getQueryValues('?');
        expect(result.initialStart).to.be.eql(start);
        expect(result.initialEnd).to.be.eql(end);
        expect(result.initialStatus).to.be.eql(ALL_STATUSES_OPTION);
        expect(result.initialProject).to.be.eql(ALL_PROJECTS_OPTION);
    });

    it('getQueryValues - custom', () => {
        const start = '2020-01-01';
        const end = '2020-02-02';
        const status = 'Closed';
        const project = 'Checkout UI';
        const result = getQueryValues(`?start=${start}&end=${end}`
            + `&status=${status}`
            + `&project=${project}`);
        expect(result.initialStart).to.be.eql(start);
        expect(result.initialEnd).to.be.eql(end);
        expect(result.initialStatus).to.be.eql(status);
        expect(result.initialProject).to.be.eql(project);
    });

    it('mapActiveIndexToTabName', () => {
        expect(mapActiveIndexToTabName(0)).to.equal('overview');
        expect(mapActiveIndexToTabName(1)).to.equal('issues');
        expect(mapActiveIndexToTabName()).to.equal('overview');
    });

    it('getActiveIndex', () => {
        expect(getActiveIndex('dog-food/overview')).to.equal(0);
        expect(getActiveIndex('dog-food/issues')).to.equal(1);
        expect(getActiveIndex()).to.equal(0);
    });

    it('mapActiveIndexToTabName', () => {
        expect(mapActiveIndexToTabName(0)).to.equal('overview');
        expect(mapActiveIndexToTabName(1)).to.equal('issues');
        expect(mapActiveIndexToTabName()).to.equal('overview');
    });
});
