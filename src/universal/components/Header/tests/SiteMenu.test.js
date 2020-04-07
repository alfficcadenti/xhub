import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import SiteMenu from '../SiteMenu';

describe('<SiteMenu />', () => {
    let wrapper;

    const dashboardsList = [
        {
            link: '/incident-trends',
            text: 'Defect & Incident Trends'
        },
        {
            link: '/resiliency-questionnaire',
            text: 'Resiliency Questionnaire'
        }
    ];

    beforeEach(() => {
        wrapper = shallow(<SiteMenu />);
        wrapper.setState({dashboardsList});
    });

    it('Renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('Renders a list with classname .dashboard-list and 5 elements', () => {
        expect(wrapper.find('.dashboard-list')).to.have.length(1);
        expect(wrapper.find('.dashboard-list>li')).to.have.length(4);
    });
});
