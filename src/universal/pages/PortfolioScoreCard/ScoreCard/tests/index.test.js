import React from 'react';
import {shallow} from 'enzyme';
import ScoreCard from '../index';
import {EG_BRAND} from '../../../../constants';

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useHistory: jest.fn(),
        useLocation: () => ({
            pathname: '/test',
            hash: '',
            search: '',
            state: ''
        }),
    };
});

describe('<ScoreCard />', () => {
    let wrapper;

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => {
                return [
                    {
                        booking_impact: 'No Quantifiable Impact',
                        brand: null,
                        degradation_outage: 'Degradation',
                        duration: '11700000'
                    }
                ];
            },
        })
    );

    it('renders successfully', () => {
        wrapper = shallow(<ScoreCard selectedBrands={[EG_BRAND]} />);
        expect(wrapper).toHaveLength(1);
    });
});
