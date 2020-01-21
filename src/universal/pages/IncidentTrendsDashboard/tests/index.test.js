import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import IncidentTrendsDashboard from '../index';
import mockData from './filteredData.test.json';

describe('<IncidentTrendsDashboard/>', () => {
    sinon.stub(IncidentTrendsDashboard.prototype, 'componentDidMount');

    it('renders successfully and call renderTabs', () => {
        const wrapper = shallow(<IncidentTrendsDashboard />);
        const instance = wrapper.instance();
        const spy = sinon.stub(instance, 'renderTabs');
        instance.forceUpdate();
        // eslint-disable-next-line no-unused-expressions
        expect(spy.calledOnce).to.be.true;
    });

    describe('handleDateRangeChange', () => {
        it('sets start and end dates in the state', async () => {
            const wrapper = shallow(<IncidentTrendsDashboard />);
            const instance = wrapper.instance();
            instance.handleDateRangeChange('2019-09-20', '2019-09-22');
            expect(instance.state.startDate).to.equal('2019-09-20');
            expect(instance.state.endDate).to.equal('2019-09-22');
        });
    });

    describe('onDateRangeClear', () => {
        it('clears start, end date', async () => {
            const wrapper = shallow(<IncidentTrendsDashboard />);
            const instance = wrapper.instance();
            instance.setState({filteredIncidents: mockData, startDate: '2019-09-20', endDate: '2019-09-20'});
            instance.handleClearDates();
            expect(instance.state.startDate).to.equal('');
            expect(instance.state.endDate).to.equal('');
        });
    });

    describe('applyFilters', () => {
        it('filters state.allIncidents based on the dates in filteredIncidents', async () => {
            const wrapper = shallow(<IncidentTrendsDashboard />);
            const instance = wrapper.instance();
            instance.setState({allIncidents: mockData});
            instance.handleDateRangeChange('2019-09-20', '2019-09-21');
            instance.applyFilters();
            expect(instance.state.filteredIncidents.length).to.equal(2);
        });

        it('filters state.allIncidents based on the Priority in filteredIncidents', async () => {
            const wrapper = shallow(<IncidentTrendsDashboard />);
            const instance = wrapper.instance();
            instance.setState({allIncidents: mockData, incPriority: '2-High'});
            instance.handleDateRangeChange('2019-08-20', '2019-10-22');
            instance.applyFilters();
            instance.forceUpdate();
            expect(instance.state.filteredIncidents.length).to.equal(2);
        });

        it('filters state.allIncidents based on the Brand in filteredIncidents', async () => {
            const wrapper = shallow(<IncidentTrendsDashboard />);
            const instance = wrapper.instance();
            instance.setState({allIncidents: mockData});
            instance.handleBrandChange('eCommerce Platform (eCP)');
            instance.handleDateRangeChange('2019-08-20', '2019-10-22');
            instance.applyFilters();
            instance.forceUpdate();
            expect(instance.state.filteredIncidents.length).to.equal(1);
        });
    });
});
