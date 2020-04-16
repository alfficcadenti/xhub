import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import SideBarComponent from '../SideBarComponent';

const links = [
    {
        main: 'Self Service Change/Cancel Health',
        id: 'change-availability',
        label: 'Change Availability',
        urls: ['https://chsxsplsrc903/en-US/app/search/covid19_health'],
        frequency: '3 hr',
        threshold: {Green: 'Status 500 <40/hr', Yellow: 'Status 500 40-50/hr', Red: 'Status 500 >50/hr'},
        monitoring: 'Splunk'
    },
    {
        main: 'Self Service Change/Cancel Health',
        id: 'cancel-availability',
        label: 'Cancel Availability',
        urls: ['https://chsxsplsrc903/en-US/app/search/covid19_health'],
        frequency: '3 hr',
        threshold: {Green: 'Status 500 <40/hr', Yellow: 'Status 500 40-50/hr', Red: 'Status 500 >50/hr'},
        monitoring: 'Splunk'
    },
    {
        main: 'Bulk Cancel Health',
        id: 'conversation-platform-downstream-service-health',
        label: 'Conversation Platform Downstream Service Health',
        urls: ['https://chsxsplsrc903/en-US/app/search/covid19_health'],
        frequency: '3 hr',
        threshold: {Green: '>99%', Yellow: '95-99%', Red: '<95%'},
        monitoring: 'Splunk'
    },
    {
        main: 'Bulk Cancel Health',
        id: 'conversation-platform-app-health-CGP',
        label: 'Conversation Platform App Health CGP',
        urls: ['https://grafana.prod.expedia.com/d/7Xu-DCXWk/covid-19-health?orgId=1&from=now-6h&to=now'],
        frequency: '3 hr',
        threshold: 'Red Sustained 5xx errors or increased/flat topping TP 95 on any app/region',
        monitoring: 'Grafana'
    },
    {
        main: 'Agent Tools/ICRS Health',
        id: 'chandler-ICRS-checkpoint-firewall-CPU-Utilization',
        label: 'Chandler ICRS checkpoint firewall CPU Utilization',
        urls: [
            'https://netperf.tools.expedia.com/d/aHdk-buZz/z_stafford-checkpoint-multiproc-for-icrs-fw?orgId=1&fullscreen&panelId=2',
            'https://netperf.tools.expedia.com/d/4SLdH6uZk/noc-covid-19-core-stability-metrics?orgId=1&from=now-3h&to=now'
        ],
        frequency: '3 hr',
        threshold: {Green: '<45%', Yellow: '45 - 50%', Red: '>50%'},
        monitoring: 'Netperf'
    },
    {
        main: 'Agent Tools/ICRS Health',
        id: 'phoenix-icrs-asa-firewall-cpu-Utilization',
        label: 'Phoenix ICRS ASA firewall CPU utilization',
        urls: [
            'https://netperf.tools.expedia.com/d/I5BwsfwZz/z_stafford-asa-sample-data?orgId=1&fullscreen&panelId=5',
            'https://netperf.tools.expedia.com/d/4SLdH6uZk/noc-covid-19-core-stability-metrics?orgId=1&from=now-3h&to=now'
        ],
        frequency: '3 hr',
        threshold: {Green: '<45%', Yellow: '45 - 50%', Red: '>50%'},
        monitoring: 'Netperf'
    },
    {
        main: 'Agent Tools/ICRS Health',
        id: 'ch-checkpoint-fw-dropped-packets',
        label: 'CH Checkpoint FW Dropped Packets',
        urls: [
            'https://netperf.tools.expedia.com/d/MpLljbuWz/icrs-checkpoint-21k-firewall?orgId=1&refresh=1m&fullscreen&panelId=5&from=now-12h&to=now',
            'https://netperf.tools.expedia.com/d/4SLdH6uZk/noc-covid-19-core-stability-metrics?orgId=1&from=now-3h&to=now'
        ],
        frequency: '3 hr',
        threshold: {Green: '<4k', Yellow: '4-5k', Red: '>5k'},
        monitoring: 'Netperf'
    },
    {
        main: 'Agent Tools/ICRS Health',
        id: 'icrs-call-center-circuit-packet-loss',
        label: 'ICRS Call Center Circuit Packet Loss',
        urls: [
            'https://netperf.tools.expedia.com/d/MpLljbuWz/icrs-checkpoint-21k-firewall?orgId=1&refresh=1m&fullscreen&panelId=5&from=now-12h&to=now',
            'https://netperf.tools.expedia.com/d/4SLdH6uZk/noc-covid-19-core-stability-metrics?orgId=1&from=now-3h&to=now'
        ],
        frequency: '3 hr',
        threshold: {Green: '<4k', Yellow: '4-5k', Red: '>5k'},
        monitoring: 'Netperf'
    },
    {
        main: 'Agent Tools/ICRS Health',
        id: 'icrs-call-and-agent-status',
        label: 'ICRS call and agent status',
        urls: [
            'https://splunk.prodp.egmonitoring.expedia.com/en-US/app/ecp-voice-dashboards/vap-voice-covid19?form.field1.earliest=-3d%40h&form.field1.latest=now'
        ],
        frequency: '3 hr',
        threshold: {Green: '<75/hr', Yellow: '75-100/h', Red: '>100/hr'},
        monitoring: 'Splunk'
    },
    {
        main: 'Agent Tools/ICRS Health',
        id: 'voyager-health-metrics',
        label: 'Voyager Health Metrics',
        urls: [
            'https://splunk.gco.expedia.com/en-US/app/Voyager/optimized_voyager_health?form.TimePicker.earliest=-60m%40m&form.TimePicker.latest=now'
        ],
        frequency: '3 hr',
        threshold: {Green: '<150/hr', Yellow: '150-200/h', Red: '>200/hr'},
        monitoring: 'Splunk'
    },
    {
        main: 'Agent Tools/ICRS Health',
        id: 'conversations-platform-health',
        label: 'Conversations Platform Health',
        urls: [
            'http://grafana.sea.corp.expecn.com/d/3qE7RO9Wz/covid-19-health?orgId=1'
        ],
        dashboardLink: 'http://grafana.sea.corp.expecn.com/d/3qE7RO9Wz/covid-19-health?orgId=1',
        renderLink: 'https://grafana.sea.corp.expecn.com/render/d-solo/3qE7RO9Wz/covid-19-health?orgId=1&from=now-3h&to=now&panelId=6&width=1000&height=500&tz=America%2FChicago',
        frequency: '3 hr',
        threshold: 'Thresholds included in dashboard, reference availability percentage tiles',
        monitoring: 'GrafanaSEA'
    },
    {
        main: 'Front Door Site Health',
        id: 'bex-eps-site-monitoring',
        label: 'BEX/EPS Site Monitoring',
        urls: [
            'https://portal.catchpoint.com'
        ],
        frequency: 'Continuous',
        threshold: 'Standard CP alerting',
        monitoring: 'Catchpoint'
    }
];

describe('SideBarComponent component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<SideBarComponent links={links}/>);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks SideBarComponent component exists', () => {
        expect(wrapper).to.have.length(1);
    });
});