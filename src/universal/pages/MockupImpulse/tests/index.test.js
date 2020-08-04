import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import Impulse from '../index';
import {EG_BRAND} from '../../../constants';
const selectedBrands = [EG_BRAND];
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

describe('<Impulse />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<Impulse selectedBrands={selectedBrands}/>);
        expect(wrapper).to.have.length(1);
    });
});
