import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import IncidentTrendsDashboard from '../index';
import mockData from './filteredData.test.json'

describe('<IncidentTrendsDashboard/>', () => {
    sinon.stub(IncidentTrendsDashboard.prototype, 'componentDidMount');

    it('renders successfully and redirects to overview given base url', () => {
        const wrapper = shallow(<IncidentTrendsDashboard />);
        expect(wrapper).to.have.length(1);
    });

    describe('handleDateRangeChange', () => {

        it('sets start and end dates', async () => {
            const wrapper = shallow(<IncidentTrendsDashboard />);
            const instance = wrapper.instance();
            instance.handleDateRangeChange('2019-09-20', '2019-09-22');
            expect(instance.state.startDate).to.equal('2019-09-20');
            expect(instance.state.endDate).to.equal('2019-09-22');

        });

        it('assign filterIncidents based on dates', async () => {
            const wrapper = shallow(<IncidentTrendsDashboard />);
            const instance = wrapper.instance();
            instance.setState({allIncidents: mockData})
            instance.handleDateRangeChange('2019-09-20', '2019-09-21');
            expect(instance.state.filteredIncidents.length).to.equal(2);
        });
    })

    describe('onDateRangeClear', () => {
        
        it('clears start, end date and filtered incidents', async () => {
            const wrapper = shallow(<IncidentTrendsDashboard />);
            const instance = wrapper.instance();
            instance.setState({filteredIncidents: mockData, startDate:'2019-09-20', endDate:'2019-09-20'})
            instance.handleClearDates();
            expect(instance.state.startDate).to.equal('');
            expect(instance.state.endDate).to.equal('');
            expect(instance.state.filteredIncidents).to.have.length(0);
        });
    })
});
