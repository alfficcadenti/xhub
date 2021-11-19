import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import AgileScorecard from '../index';
import {labelFormat, formatPieData} from '../utils';

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
    const MOCK_DISTRIBUTION = [
        {
            'type_of_work': 'techInitiatives',
            'ticket_count': 3,
            'ticket_ids': 'EGE-354987,EGE-353467,EGE-353926'
        },
        {
            'type_of_work': 'bau',
            'ticket_count': 10,
            'ticket_ids': 'EGE-354987,EGE-353467,EGE-353926,EGE-353467,EGE-353926,EGE-353467,EGE-353926,EGE-359119,EGE-359119,EGE-359119'
        },
        {
            'type_of_work': 'roadmap',
            'ticket_count': 8,
            'ticket_ids': 'EGE-354987,EGE-353467,EGE-353926,EGE-353467,EGE-353926,EGE-353467,EGE-353926,EGE-359119'
        }
    ];

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
});