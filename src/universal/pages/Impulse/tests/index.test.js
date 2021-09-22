import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import {BrowserRouter as Router} from 'react-router-dom';
import Impulse from '../index';
import {EG_BRAND} from '../../../constants';

global.fetch = require('node-fetch');

const selectedBrands = [EG_BRAND];
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useLocation: () => ({
            pathname: '/test',
            hash: '',
            search: '',
            state: ''
        }),
    };
});

describe('<Impulse />', () => {
    const wrapper = mount(<Router>
        <Impulse selectedBrands={selectedBrands}/>
    </Router>);

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
    it('LoadingContainer should have right props', async () => {
        const props = wrapper.find('LoadingContainer').at(1).props();
        expect(props.isLoading).equal(true);
        expect(props.error).equal('');
    });
});
