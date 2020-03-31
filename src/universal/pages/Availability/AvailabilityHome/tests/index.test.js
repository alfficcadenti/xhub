import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import AvailabilityHome from '../AvailabilityHome';

const props = [
    {
        id: 'conversation-platform-app-health-CGP',
        label: 'Conversation Platform App Health CGP',
        urls: ['https://grafana.prod.expedia.com/d/7Xu-DCXWk/covid-19-health?orgId=1&from=now-6h&to=now'],
        frequency: '3 hr',
        threshold: 'Red Sustained 5xx errors or increased/flat topping TP 95 on any app/region'
    },
    {
        id: 'chandler-ICRS-checkpoint-firewall-CPU-Utilization',
        label: 'Chandler ICRS checkpoint firewall CPU Utilization',
        urls: [
            'https://netperf.tools.expedia.com/d/aHdk-buZz/z_stafford-checkpoint-multiproc-for-icrs-fw?orgId=1&fullscreen&panelId=2',
            'https://netperf.tools.expedia.com/d/4SLdH6uZk/noc-covid-19-core-stability-metrics?orgId=1&from=now-3h&to=now'
        ],
        frequency: '3 hr',
        threshold: 'Green <45% Yellow 45 - 50% Red >50%'
    },
];

describe('<DashboardWrapper />', () => {
    it('renders successfully a div with id #home-buttons-container', () => {
        const wrapper = shallow(
            <AvailabilityHome links={props} />
        );
        expect(wrapper.find('div#home-buttons-container')).to.have.length(1);
    });

    it('renders successfully a div with id #home-buttons-container', () => {
        const wrapper = shallow(
            <AvailabilityHome links={props} />);
        expect(wrapper.find('.dashboard-button')).to.have.length(2);
    });
});