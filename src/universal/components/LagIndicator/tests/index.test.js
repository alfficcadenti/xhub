import React from 'react';
import {shallow} from 'enzyme';
import LagIndicator from '../index';
import {
    EXPEDIA_BRAND,
} from '../../../constants';

describe('<LagIndicator /> ', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<LagIndicator selectedBrand={EXPEDIA_BRAND} />);
        expect(wrapper.find('iframe')).toHaveLength(1);
    });

    it('does not render when invalid brand', () => {
        const wrapper = shallow(<LagIndicator selectedBrand={''} />);
        expect(wrapper.find('iframe')).toHaveLength(0);
    });
});