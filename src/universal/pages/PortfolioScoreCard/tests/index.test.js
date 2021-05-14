import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import PortfolioScoreCard from '../index';
import {EG_BRAND} from '../../../constants';


jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useHistory: () => ({
            push: jest.fn(),
        }),
        useLocation: () => ({
            pathname: '/test',
            hash: '',
            search: '',
            state: ''
        }),
    };
});

describe('<PortfolioScoreCard />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<PortfolioScoreCard selectedBrands={[EG_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
