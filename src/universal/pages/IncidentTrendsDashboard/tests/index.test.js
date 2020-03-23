import React from 'react';
import {shallow} from 'enzyme';
import IncidentTrendsDashboard from '../index';
import {DATE_FORMAT} from '../constants';
import moment from 'moment';

describe('<IncidentTrendsDashboard/>', () => {
    const wrapper = shallow(<IncidentTrendsDashboard />);

    it('renders successfully', () => {
        shallow(<IncidentTrendsDashboard/>);
    });

    it('sets correctly default start and end dates', async () => {
        const startDateDefaultValue = moment().subtract(7, 'weeks').format(DATE_FORMAT);
        const endDateDefaultValue = moment().format(DATE_FORMAT);

        const props = wrapper.find('DatePicker').props();
        expect(props.startDate).toBe(startDateDefaultValue);
        expect(props.endDate).toBe(endDateDefaultValue);
    });

    it('Navigation tab has correct tabs', async () => {
        const props = wrapper.find('Navigation').props();
        expect(props.links[0].id).toBe('overview');
        expect(props.links[1].id).toBe('incidents');
        expect(props.links[2].id).toBe('top5');
        expect(props.links[3].id).toBe('quality');
        expect(props.links[4].id).toBe('financialImpact');
    });

    it('Navigation receives active index 1 by default', async () => {
        const props = wrapper.find('Navigation').props();
        expect(props.activeIndex).toBe(1);
    });

    it('FilterDropDown renders 2 times', async () => {
        const props = wrapper.find('FilterDropDown').first().props();
        expect(props.selectedValue).toBe('All - P1 & P2');
    });

    it('LoadingContainer should have right props', async () => {
        const props = wrapper.find('LoadingContainer').props();
        expect(props.isLoading).toEqual(true);
        expect(props.error).toEqual('');
    });
});
