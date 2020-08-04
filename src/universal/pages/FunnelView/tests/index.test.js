import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import FunnelView from '../';
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

describe('FunnelView component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<FunnelView selectedBrands={[EG_BRAND]} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
