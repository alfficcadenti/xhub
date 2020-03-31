import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import DashboardWrapper from '../DashboardWrapper';

const props = {
    label: 'Conversation Platform App Health CGP',
    href: '/conversation-platform-app-health-CGP',
    urls: ['https://grafana.prod.expedia.com/d/7Xu-DCXWk/covid-19-health?orgId=1&from=now-6h&to=now'],
    frequency: '3 hr',
    threshold: 'Red Sustained 5xx errors or increased/flat topping TP 95 on any app/region'
};

describe('<DashboardWrapper />', () => {
    it('renders successfully a div with id #dashboard-wrapper-component', () => {
        const wrapper = shallow(
            <DashboardWrapper
                label={props.label}
                href={props.href}
                urls={props.urls}
                frequency={props.labfrequency}
                threshold={props.threshold}
            />);
        expect(wrapper.find('div#dashboard-wrapper-component')).to.have.length(1);
    });
    it('renders successfully a div with splunk instructions if monitoring=splunk', () => {
        const wrapper = shallow(
            <DashboardWrapper
                label={props.label}
                href={props.href}
                urls={props.urls}
                frequency={props.labfrequency}
                threshold={props.threshold}
                monitoring={'Splunk'}
            />);
        expect(wrapper.find('div#splunk-instructions')).to.have.length(1);
    });
});