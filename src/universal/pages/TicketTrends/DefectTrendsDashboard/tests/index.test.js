import React from 'react';
import {mount} from 'enzyme';
import {BrowserRouter as Router} from 'react-router-dom';
import DefectTrendsDashboard from '../index';
import {DATE_FORMAT} from '../../../../constants';
import {EG_BRAND} from '../../../../constants';
import moment from 'moment/moment';
import {expect} from 'chai';

global.fetch = require('node-fetch');


describe('<DefectTrendsDashboard />', () => {
    const wrapper = mount(<Router>
        <DefectTrendsDashboard selectedBrands={[EG_BRAND]} prevSelectedBrand={EG_BRAND} onChange={() => {}} />
    </Router>);

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

    it('LoadingContainer should have right props', async () => {
        const props = wrapper.find('LoadingContainer').props();
        expect(props.isLoading).equal(true);
        expect(props.error).equal('');
    });
});
