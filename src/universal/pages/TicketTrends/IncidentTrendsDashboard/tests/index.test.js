import React from 'react';
import {mount} from 'enzyme';
import {BrowserRouter as Router} from 'react-router-dom';
import IncidentTrendsDashboard from '../index';
import {DATE_FORMAT} from '../../../../constants';
import {EG_BRAND} from '../../../../constants';
import moment from 'moment/moment';
import {expect} from 'chai';

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

describe('<IncidentTrendsDashboard/>', () => {
    const wrapper = mount(<Router>
        <IncidentTrendsDashboard selectedBrands={[EG_BRAND]} />
    </Router>);

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('sets correctly default start and end dates', async () => {
        const startDateDefaultValue = moment().subtract(14, 'days').format(DATE_FORMAT);
        const endDateDefaultValue = moment().format(DATE_FORMAT);

        const props = wrapper.find('DatePicker').props();
        expect(props.startDate).equal(startDateDefaultValue);
        expect(props.endDate).equal(endDateDefaultValue);
    });

    it('Navigation tab has correct tabs', async () => {
        const props = wrapper.find('Navigation').props();
        expect(props.links[0].id).equal('overview');
        expect(props.links[1].id).equal('incidents');
        expect(props.links[2].id).equal('top5');
    });

    it('Navigation receives active index 1 by default', async () => {
        const props = wrapper.find('Navigation').props();
        expect(props.activeIndex).equal(1);
    });

    it('FilterDropDown render default priority value', async () => {
        const props = wrapper.find('FilterDropDown').first().props();
        expect(props.selectedValue).equal('All Priorities');
    });

    it('LoadingContainer should have right props', async () => {
        const props = wrapper.find('LoadingContainer').props();
        expect(props.isLoading).equal(true);
        expect(props.error).equal('');
    });
});
