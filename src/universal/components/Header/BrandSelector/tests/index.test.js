import React from 'react';
import {shallow} from 'enzyme/build';
import BrandSelector from '../index';
import {expect} from 'chai';

describe('<BrandSelector />', () => {
    const wrapper = shallow(
        <BrandSelector selectedBrands={['EXPEDIA', 'EGENCIA', 'VRBO']} brands={['EXPEDIA', 'EGENCIA', 'VRBO']} />
    );

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
