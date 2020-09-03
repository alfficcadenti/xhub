import React from 'react';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme/build';
import ChangeRequests from '../ChangeRequests';
import mockData from '../../../test/mock.json';
import {EG_BRAND, EXPEDIA_BRAND} from '../../../../../constants';


describe('Change Requests component testing', () => {
    it('checks Change Requests component exists', () => {
        const wrapper = shallow(<ChangeRequests filteredCR={mockData}/>);
        expect(wrapper).to.have.length(1);
    });

    it('renders Change Requests when filtered CR array is empty', () => {
        const wrapperEmpty = shallow(<ChangeRequests filteredCR={[]}/>);
        expect(wrapperEmpty).to.have.length(1);
    });

    it('renders table with platform as the last column if brand is like the constant EG_BRAND', () => {
        const wrapper = mount(<ChangeRequests filteredCR={mockData} selectedBrand={EG_BRAND}/>);
        expect(wrapper.find('th').last().text()).to.be.eql('Platform');
        expect(wrapper.find('th')).to.have.length(9);
    });

    it('renders table  with team as the last column if brand is different than EG_BRAND', () => {
        const wrapper = mount(<ChangeRequests filteredCR={mockData} selectedBrand={EXPEDIA_BRAND}/>);
        expect(wrapper.find('th').last().text()).to.be.eql('Team');
        expect(wrapper.find('th')).to.have.length(8);
    });
});