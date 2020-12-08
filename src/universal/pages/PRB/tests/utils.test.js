import {expect} from 'chai';
import {
    getQueryValues,
    getUrlParam,
    mapActiveIndexToTabName,
    getActiveIndex
} from '../utils';
import {
    ALL_STATUSES_OPTION,
    ALL_PRIORITIES_OPTION,
    ALL_TYPES_OPTION,
    ALL_ORGS_OPTION,
    ALL_RC_OWNERS_OPTION,
    ALL_RC_CATEGORIES_OPTION
} from '../../../constants';

describe('PRB Utils', () => {
    it('getQueryValues - default', () => {
        const start = '2020-01-01';
        const end = '2020-02-02';
        const l1 = 'business';
        const result = getQueryValues(`?start=${start}&end=${end}&l1=${l1}`);
        expect(result.initialStart.isSame(start, 'day')).to.be.eql(true);
        expect(result.initialEnd.isSame(end, 'day')).to.be.eql(true);
        expect(result.initialType).to.be.eql(ALL_TYPES_OPTION);
        expect(result.initialStatus).to.be.eql(ALL_STATUSES_OPTION);
        expect(result.initialPriority).to.be.eql(ALL_PRIORITIES_OPTION);
        expect(result.initialOrg).to.be.eql(ALL_ORGS_OPTION);
        expect(result.initialRcOwner).to.be.eql(ALL_RC_OWNERS_OPTION);
        expect(result.initialRcCategory).to.be.eql(ALL_RC_CATEGORIES_OPTION);
        expect(result.initialL1).to.be.eql(l1);
    });

    it('getQueryValues - custom', () => {
        const start = '2020-01-01';
        const end = '2020-02-02';
        const type = 'Epic';
        const status = 'Closed';
        const priority = '2-High';
        const org = 'Egencia';
        const rcOwner = 'EWE';
        const rcCategory = 'Architectural';
        const l1 = 'business';
        const result = getQueryValues(`?start=${start}&end=${end}`
            + `&type=${type}`
            + `&status=${status}`
            + `&priority=${priority}`
            + `&org=${org}`
            + `&rcowner=${rcOwner}`
            + `&rccategory=${rcCategory}`
            + `&l1=${l1}`);
        expect(result.initialStart.isSame(start, 'day')).to.be.eql(true);
        expect(result.initialEnd.isSame(end, 'day')).to.be.eql(true);
        expect(result.initialType).to.be.eql(type);
        expect(result.initialStatus).to.be.eql(status);
        expect(result.initialPriority).to.be.eql(priority);
        expect(result.initialOrg).to.be.eql(org);
        expect(result.initialRcOwner).to.be.eql(rcOwner);
        expect(result.initialRcCategory).to.be.eql(rcCategory);
        expect(result.initialL1).to.be.eql(l1);
    });

    it('getUrlParam', () => {
        const label = 'label';
        const valueA = 'a';
        const valueB = 'b';
        expect(getUrlParam(label, valueA, valueB)).to.equal(`&${label}=${valueA}`);
        expect(getUrlParam(label, valueA, valueA)).to.equal('');
    });

    it('mapActiveIndexToTabName', () => {
        expect(mapActiveIndexToTabName(0)).to.equal('overview');
        expect(mapActiveIndexToTabName(1)).to.equal('tickets');
        expect(mapActiveIndexToTabName(2)).to.equal('corrective-actions');
        expect(mapActiveIndexToTabName()).to.equal('overview');
    });

    it('getActiveIndex', () => {
        expect(getActiveIndex('prb/overview')).to.equal(0);
        expect(getActiveIndex('prb/tickets')).to.equal(1);
        expect(getActiveIndex('prb/corrective-actions')).to.equal(2);
        expect(getActiveIndex()).to.equal(0);
    });

    it('mapActiveIndexToTabName', () => {
        expect(mapActiveIndexToTabName(0)).to.equal('overview');
        expect(mapActiveIndexToTabName(1)).to.equal('tickets');
        expect(mapActiveIndexToTabName(2)).to.equal('corrective-actions');
        expect(mapActiveIndexToTabName()).to.equal('overview');
    });
});