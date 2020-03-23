import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import ExpandableRow from '../ExpandableRow';


describe('ExpandableRow component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <ExpandableRow
                executiveSummary={'Multiple Contact Centers SynApps Degraded'}
            />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks ExpandableRow component exists', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders ExpandableRow summary correctly', () => {
        expect(wrapper.find('.expandable-row-section').text()).to.eql('Multiple Contact Centers SynApps Degraded');
    });
});
