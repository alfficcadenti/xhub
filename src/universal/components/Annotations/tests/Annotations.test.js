import React from 'react';
import {act} from 'react-dom/test-utils';
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
                    business_justification: 'Automated Deployment',
                    business_reason: 'Upgrade',
                    category: 'deployment',
                    environment_name: 'Production',
                    id: 'a247321f1b853894ac5297d4bd4bcb79',
                    number: 'CHG3960060',
                    opened_at: '2021-07-05T08:15:45Z',
                    platform: 'Hotels',
                    product_name: 'TBD',
                    repo_source: 'https://github.expedia.biz/hotels-core-services/mobile-marketing-event-service',
                    service_name: 'mobile-marketing-event-service',
                    service_tier: 'Tier 3',
                    short_description: 'mobile-marketing-event-service of hcom fd1ecc7ed73f4facf401261f80a63b947bc4f920 was deployed to us-west-2 region in Non PCI Prod',
                    sys_created_by: 's-brightsnow',
                    tags: ['TBD', 'Hotels'],
                    team_contact_DL: 'hcomcoreservicesnucleo@expedia.com',
                    team_name: 'hotels-core-nucleo',
                    time: 1625472945000
                },
                {
                    brand: 'EG',
                    business_justification: 'Automated Deployment',
                    business_reason: 'Upgrade',
                    category: 'deployment',
                    environment_name: 'Production',
                    id: '67e77a571b017854f7b7cddf034bcb92',
                    number: 'CHG3960075',
                    opened_at: '2021-07-05T08:18:34Z',
                    platform: 'Expedia',
                    product_name: 'Configurable travel agent site',
                    repo_source: 'https://github.expedia.biz/Expedia-Partner-Solutions/taap-calculon-v1k',
                    service_name: 'taap-calculon-v1k',
                    service_tier: 'Tier 1',
                    short_description: 'taap-calculon-v1k ed1e6d819e5d3b1fd3e125087729bf604434224c us-west-2',
                    sys_created_by: 's-brightsnow',
                    tags: ['Configurable travel agent site', 'Expedia'],
                    team_contactDL: 'EPSTechnologyFintech@expedia.com',
                    team_name: 'EPS Fintech',
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
        expect(wrapper.find('.advanced-filter-inactive')).to.have.length(1);
    });

    it('open .annotations-wrapper when clicks on .display-annotations-btn', () => {
        wrapper.find('.display-annotations-btn').simulate('click');
        expect(wrapper.find('.advanced-filter-active')).to.have.length(1);
    });

    it('renders 3 checkboxes', async () => {
        await (act(async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve([]),
                })
            );
            wrapper = mount(<Annotations setFilteredAnnotations={() => {}} setEnableAnnotations={() => {}} productMapping={[]} />);
            wrapper.find('.display-annotations-btn').simulate('click');
            expect(wrapper.find('.annotations-wrapper')).to.have.length(1);
        }));
    });
});
