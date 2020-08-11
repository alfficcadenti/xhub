import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme/build';
import ChangeRequests from '../ChangeRequests';
import mockData from '../../../test/mock.json';


describe('Change Requests component testing', () => {
    it('checks Change Requests component exists', () => {
        const wrapper = shallow(<ChangeRequests filteredCR={mockData}/>);
        expect(wrapper).to.have.length(1);
    });

    it('render Change Requests when filtered CR array is empty', () => {
        const wrapperEmpty = shallow(<ChangeRequests filteredCR={[]}/>);
        expect(wrapperEmpty).to.have.length(1);
    });
});