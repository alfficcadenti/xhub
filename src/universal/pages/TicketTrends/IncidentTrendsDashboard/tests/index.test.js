import React from 'react';
import {shallow} from 'enzyme/build';
import IncidentTrendsDashboard from '../index';
import {DATE_FORMAT} from '../../../../constants';
import {EG_BRAND} from '../../../../constants';
import moment from 'moment/moment';


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

describe('<IncidentTrendsDashboard/>', () => {
    const wrapper = shallow(<IncidentTrendsDashboard selectedBrands={[EG_BRAND]} />);

    it('renders successfully', () => {
        shallow(<IncidentTrendsDashboard selectedBrands={[EG_BRAND]}/>);
    });

    it('sets correctly default start and end dates', async () => {
        const startDateDefaultValue = moment().subtract(14, 'days').format(DATE_FORMAT);
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
        expect(props.links[3].id).toBe('financialImpact');
    });

    it('Navigation receives active index 1 by default', async () => {
        const props = wrapper.find('Navigation').props();
        expect(props.activeIndex).toBe(1);
    });

    it('FilterDropDown render default priority value', async () => {
        const props = wrapper.find('FilterDropDown').first().props();
        expect(props.selectedValue).toBe('All Priorities');
    });

    it('LoadingContainer should have right props', async () => {
        const props = wrapper.find('LoadingContainer').props();
        expect(props.isLoading).toEqual(true);
        expect(props.error).toEqual('');
    });
});
