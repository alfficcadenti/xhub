import React from 'react';
import {shallow} from 'enzyme';
import LagIndicator from '../index';
import {expect} from 'chai';
import {
    EXPEDIA_BRAND,
    EGENCIA_BRAND
} from '../../../constants';

import {selectAttributes} from '../index';

describe('<LagIndicator /> ', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<LagIndicator selectedBrand={EXPEDIA_BRAND} />);
        expect(wrapper.find('iframe')).to.have.length(1);
    });

    it('does not render when invalid brand', () => {
        const wrapper = shallow(<LagIndicator selectedBrand={''} />);
        expect(wrapper.find('iframe')).to.have.length(0);
    });

    it('selectAttributes - returns valid values', () => {
        const result = selectAttributes(EXPEDIA_BRAND);
        expect(result).to.eql({token: '1865fed42a02636eb6baa6448ad4671b76604611347794e00d815163a79a18f0', title: 'UISPrime Lag'});
    });

    it('selectAttributes - returns null', () => {
        const result = selectAttributes(EGENCIA_BRAND);
        expect(result).to.eql({token: null, title: null});
    });
});