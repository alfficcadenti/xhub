import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import AgileScorecard from '../index';
import {labelFormat, formatPieData, formatLineChartData, formatTooltipData} from '../utils';
import {MOCK_NUMBER_OF_BUGS, MOCK_DISTRIBUTION} from '../../../../server/routes/api/testData/agileScoreCard';
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useLocation: () => ({
            pathname: '/agile-scorecard',
            hash: '',
            search: '',
            state: ''
        }),
    };
});

describe('<AgileScorecard />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<AgileScorecard />);
        expect(wrapper).to.have.length(1);
    });
});

describe('labelFormat()', () => {
    it('returns array for labels', () => {
        const toRender = {count: 10, total: 50, label: 'teams'};
        const label = labelFormat(toRender);
        expect(label).to.be.eql('teams  (10 of 50 selected)');
    });
});

describe('formatPieData()', () => {
    const EXPECTED_RESULT = [
        {'name': 'techInitiatives', 'value': 3},
        {'name': 'bau', 'value': 10},
        {'name': 'roadmap', 'value': 8}
    ];

    it('returns data formatted for chart', () => {
        const label = formatPieData(MOCK_DISTRIBUTION);
        expect(label).to.be.eql(EXPECTED_RESULT);
    });

    it('returns empty array when data is undefined', () => {
        const label = formatPieData();
        expect(label).to.be.eql([]);
    });

    it('returns empty array when data is empty array', () => {
        const label = formatPieData([]);
        expect(label).to.be.eql([]);
    });

    it('returns empty array when data is not an array', () => {
        const label = formatPieData({});
        expect(label).to.be.eql([]);
    });
});

describe('formatLineChartData()', () => {
    const EXPECTED_RESULT = [
        {'name': '1st-11-2021', 'open bugs': 110, 'closed bugs': 51},
        {'name': '2nd-11-2021', 'open bugs': 6, 'closed bugs': 40},
        {'name': '3rd-11-2021', 'open bugs': 90, 'closed bugs': 90}
    ];

    it('returns data formatted for chart', () => {
        const label = formatLineChartData(MOCK_NUMBER_OF_BUGS);
        expect(label).to.be.eql(EXPECTED_RESULT);
    });

    it('returns empty array when data is undefined', () => {
        const label = formatLineChartData();
        expect(label).to.be.eql([]);
    });

    it('returns empty array when data is empty array', () => {
        const label = formatLineChartData([]);
        expect(label).to.be.eql([]);
    });

    it('returns empty array when data is not an array', () => {
        const label = formatLineChartData({});
        expect(label).to.be.eql([]);
    });
});

describe('formatTooltipData()', () => {
    const EXPECTED_RESULT = {'1st-11-2021': {'closed bugs': ['EDECO-12071', 'LUX-10788'], 'open bugs': ['RTS-4057', 'LEO-15833', 'LEO-15834', 'LLAM-1356']}, '2nd-11-2021': {'closed bugs': ['EDECO-12071', 'LUX-10788'], 'open bugs': ['RTS-4057', 'LEO-15833', 'LEO-15834', 'LLAM-1356']}, '3rd-11-2021': {'closed bugs': ['EDECO-12071', 'LUX-10788'], 'open bugs': ['RTS-4057', 'LEO-15833', 'LEO-15834', 'LLAM-1356']}};
    it('returns data formatted for modal', () => {
        const label = formatTooltipData(MOCK_NUMBER_OF_BUGS);
        expect(label).to.be.eql(EXPECTED_RESULT);
    });

    it('returns empty object when data is undefined', () => {
        const label = formatTooltipData();
        expect(label).to.be.eql({});
    });

    it('returns empty object when data is empty array', () => {
        const label = formatTooltipData([]);
        expect(label).to.be.eql({});
    });

    it('returns empty object when data is not an array', () => {
        const label = formatTooltipData({});
        expect(label).to.be.eql({});
    });
});