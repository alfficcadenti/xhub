import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import SuccessRates from '../';
import {EG_BRAND} from '../../../constants';
import {BrowserRouter as Router} from 'react-router-dom';
import {getErrorMessage} from '../constants';


global.fetch = require('node-fetch');
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

describe('SuccessRates component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<Router>
            <SuccessRates selectedBrands={[EG_BRAND]} />
        </Router>);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('LoadingContainer should have right props', async () => {
        wrapper.setProps({selectedBrands: [EG_BRAND]});
        const props = wrapper.find('.success-rates-loading-container').at(0).props();
        expect(props.isLoading).equal(true);
        expect(props.error).equal(getErrorMessage(EG_BRAND));
    });
});
