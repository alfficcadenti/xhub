import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import SuccessRates from '../';
import {EG_BRAND} from '../../../constants';

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

describe('SuccessRates component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<SuccessRates selectedBrands={[EG_BRAND]} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
