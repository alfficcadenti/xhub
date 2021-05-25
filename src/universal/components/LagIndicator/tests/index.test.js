import React from 'react';
import {shallow} from 'enzyme';
import LagIndicator from '../index';
import {
    EXPEDIA_BRAND,
    EGENCIA_BRAND,
} from '../../../constants';

describe('<LagIndicator /> ', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<LagIndicator selectedBrand={EXPEDIA_BRAND} />);
        expect(wrapper).toHaveLength(1);
    });

    it('does not render when invalid brand', () => {
        const wrapper = shallow(<LagIndicator selectedBrand={EGENCIA_BRAND} />);
        expect(wrapper).toHaveLength(1);
    });
});