import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import {BrowserRouter as Router} from 'react-router-dom';
import FunnelView from '../';
import {EG_BRAND} from '../../../constants';
import {getErrorMessage} from '../utils';


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

describe('FunnelView component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<Router>
            <FunnelView selectedBrands={[EG_BRAND]} />
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
        const props = wrapper.find('.page-views-loading-container').at(0).props();
        expect(props.isLoading).equal(false);
        expect(props.error).equal(getErrorMessage(EG_BRAND));
    });
});
