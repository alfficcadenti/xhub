import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import QualityMetrics from '../index';

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useHistory: jest.fn(),
        useLocation: () => ({
            pathname: '/quality-metrics',
            hash: '',
            search: '',
            state: ''
        }),
    };
});

describe('<QualityMetrics>', () => {
    const location = {pathname: '/quality-metrics/'};
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<QualityMetrics selectedBrands={['Hotels.com Retail']} match="" history={history} location={location} />);
    });

    it('renders successfully with default portfolio given base url', () => {
        expect(wrapper).to.have.length(1);
    });
});
