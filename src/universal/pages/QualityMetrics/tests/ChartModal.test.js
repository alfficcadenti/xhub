import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import ChartModal from '../ChartModal';

describe('<ChartModal>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<ChartModal title="title" isOpen={false} data={[]} onClose={() => {}} />);
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
