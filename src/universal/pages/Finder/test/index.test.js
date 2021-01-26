import React from 'react';
import {mount} from 'enzyme';
import Finder from '../index';
import {EG_BRAND} from '../../../constants';
import {expect} from 'chai';
import {BrowserRouter as Router} from 'react-router-dom';

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

describe('<Finder/>', () => {
    const wrapper = mount(<Router>
        <Finder selectedBrands={[EG_BRAND]} />
    </Router>);

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('LoadingContainer should have right props', async () => {
        const props = wrapper.find('LoadingContainer').props();
        expect(props.isLoading).to.be.eql(true);
        expect(props.error).to.be.eql('');
    });
});
