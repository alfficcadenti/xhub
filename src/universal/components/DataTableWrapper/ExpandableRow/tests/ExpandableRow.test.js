import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme/build';
import ExpandableRow from '../ExpandableRow';


describe('ExpandableRow component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <ExpandableRow
                executiveSummary={'Multiple Contact Centers SynApps Degraded'}
                rootCause={'Resolution notes summary here'}
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
        expect(wrapper.find('.expandable-row-section').first().text()).to.eql('Multiple Contact Centers SynApps Degraded');
        expect(wrapper.find('.expandable-row-section').at(1).text()).to.eql('Resolution notes summary here');
    });
});
