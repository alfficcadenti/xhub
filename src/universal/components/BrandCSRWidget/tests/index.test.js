import React from 'react';
import {shallow} from 'enzyme/build';
import BrandCSRWidget from '../index';
import {expect} from 'chai';

describe('<BrandCSRWidget />', () => {
    const wrapper = shallow(
        <BrandCSRWidget />
    );

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
