import React from 'react';
import {shallow} from 'enzyme';
import PageView from '../index';
import {expect} from 'chai';

const brands = ['Expedia', 'Hotels.com', 'Vrbo', 'Expedia Business Services', 'Other'];

describe('<PageView />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<PageView title="title" data={[]} brands={brands}/>);
        expect(wrapper).to.have.length(1);
    });
});
