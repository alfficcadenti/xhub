import React from 'react';
import {shallow, mount} from 'enzyme/build';
import BrandSelector from '../index';
import {EG_BRAND, EGENCIA_BRAND, VRBO_BRAND} from '../../../../constants';

const props = {
    brands: [EG_BRAND, EGENCIA_BRAND, VRBO_BRAND],
    selectedBrands: [EG_BRAND, EGENCIA_BRAND, VRBO_BRAND],
    getBrand: () => {},
    onBrandChange: () => {},
};

describe('<BrandSelector />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(
            <BrandSelector {...props} />
        );
        expect(wrapper).toHaveLength(1);
    });

    it('clicks on brand and filters successfully', () => {
        const wrapper = mount(<BrandSelector {...props} />);
        expect(wrapper.exists()).toBeTruthy();
        const mEvent = {stopPropagation: jest.fn(), preventDefault: jest.fn()};
        wrapper.find('#brand-selector').at(0).simulate('click');
        wrapper.find('#brand-selector--container a').at(2).simulate('click', mEvent);
        expect(mEvent.preventDefault).toBeCalledTimes(1);
    });
});
