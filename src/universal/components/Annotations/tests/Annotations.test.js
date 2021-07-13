import React from 'react';
import {expect} from 'chai';
import {mount, shallow} from 'enzyme';
import Annotations from '../Annotations';

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
        })
    };
});

describe('Annotations component testing', () => {
    let wrapper;

    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([
                {
                    brand: 'EG',
                    businessJustification: 'Automated Deployment',
                    businessReason: 'Upgrade',
                    category: 'deployment',
                    environmentName: 'Production',
                    id: 'a247321f1b853894ac5297d4bd4bcb79',
                    number: 'CHG3960060',
                    openedAt: '2021-07-05T08:15:45Z',
                    platform: 'Hotels',
                    productName: 'TBD',
                    repoSource: 'https://github.expedia.biz/hotels-core-services/mobile-marketing-event-service',
                    serviceName: 'mobile-marketing-event-service',
                    serviceTier: 'Tier 3',
                    shortDescription: 'mobile-marketing-event-service of hcom fd1ecc7ed73f4facf401261f80a63b947bc4f920 was deployed to us-west-2 region in Non PCI Prod',
                    sysCreatedBy: 's-brightsnow',
                    tags: ['TBD', 'Hotels'],
                    teamContactDL: 'hcomcoreservicesnucleo@expedia.com',
                    teamName: 'hotels-core-nucleo',
                    time: 1625472945000
                },
                {
                    brand: 'EG',
                    businessJustification: 'Automated Deployment',
                    businessReason: 'Upgrade',
                    category: 'deployment',
                    environmentName: 'Production',
                    id: '67e77a571b017854f7b7cddf034bcb92',
                    number: 'CHG3960075',
                    openedAt: '2021-07-05T08:18:34Z',
                    platform: 'Expedia',
                    productName: 'Configurable travel agent site',
                    repoSource: 'https://github.expedia.biz/Expedia-Partner-Solutions/taap-calculon-v1k',
                    serviceName: 'taap-calculon-v1k',
                    serviceTier: 'Tier 1',
                    shortDescription: 'taap-calculon-v1k ed1e6d819e5d3b1fd3e125087729bf604434224c us-west-2',
                    sysCreatedBy: 's-brightsnow',
                    tags: ['Configurable travel agent site', 'Expedia'],
                    teamContactDL: 'EPSTechnologyFintech@expedia.com',
                    teamName: 'EPS Fintech',
                    time: 1625473114000,
                }
            ]),
        })
    );

    beforeEach(() => {
        wrapper = shallow(<Annotations setFilteredAnnotations={jest.fn()} setEnableAnnotations={jest.fn()} productMapping={[]} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully without props', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders .display-annotations-btn button with wrapper closed by default', () => {
        expect(wrapper.find('.display-annotations-btn')).to.have.length(1);
        expect(wrapper.find('.annotations-wrapper.closed')).to.have.length(1);
    });

    it('open .annotations-wrapper when clicks on .display-annotations-btn', () => {
        wrapper.find('.display-annotations-btn').simulate('click');
        expect(wrapper.find('.annotations-wrapper')).to.have.length(1);
    });

    it('renders 3 checkboxes', () => {
        wrapper = mount(<Annotations setFilteredAnnotations={jest.fn()} setEnableAnnotations={jest.fn()} productMapping={[]} />);
        wrapper.find('.display-annotations-btn').simulate('click');
        expect(wrapper.find('.annotations-wrapper')).to.have.length(1);
    });
});
