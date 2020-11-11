import React from 'react';
import {shallow} from 'enzyme/build';
import Fci from '../index';
import {EG_BRAND} from '../../../constants';
import {expect} from 'chai';


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

describe('<Fci/>', () => {
    const wrapper = shallow(<Fci selectedBrands={[EG_BRAND]} />);

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});