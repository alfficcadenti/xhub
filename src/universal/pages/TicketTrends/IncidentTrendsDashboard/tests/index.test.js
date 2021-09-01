import React from 'react';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import {BrowserRouter as Router} from 'react-router-dom';
import IncidentTrendsDashboard from '../index';
import {DATE_FORMAT} from '../../../../constants';
import {EG_BRAND, ALL_PRIORITIES_OPTION, OPXHUB_SUPPORT_CHANNEL} from '../../../../constants';
import moment from 'moment/moment';
import {expect} from 'chai';

global.fetch = require('node-fetch');


const waitForComponentToPaint = async (wrapper) => {
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
    });
};

describe('<IncidentTrendsDashboard/>', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(<Router>
            <IncidentTrendsDashboard selectedBrands={[EG_BRAND]} />
        </Router>);
        await waitForComponentToPaint(wrapper);
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('sets correctly default start and end dates', async () => {
        const startDateDefaultValue = moment().subtract(14, 'days').format(DATE_FORMAT);
        const endDateDefaultValue = moment().format(DATE_FORMAT);

        const props = wrapper.find('DatetimeRangePicker').props();
        expect(moment(props.startDate).format(DATE_FORMAT)).equal(startDateDefaultValue);
        expect(moment(props.endDate).format(DATE_FORMAT)).equal(endDateDefaultValue);
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
        expect(props.selectedValue).equal(ALL_PRIORITIES_OPTION);
    });

    it('LoadingContainer should have right props', async () => {
        const props = wrapper.find('LoadingContainer').props();
        expect(props.isLoading).equal(false);
        expect(props.error).equal(`Error occurred when reading tickets. Please try refreshing the page. If this problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`);
    });
});
