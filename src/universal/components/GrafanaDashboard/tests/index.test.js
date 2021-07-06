import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import GrafanaDashboard from '../index';
import {
    EXPEDIA_BRAND,
    VRBO_BRAND,
} from '../../../constants';

describe('<GrafanaDashboard /> ', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<GrafanaDashboard />);
        expect(wrapper).to.have.length(1);
    });

    it('does not render when invalid brand', () => {
        const wrapper = mount(<GrafanaDashboard selectedBrands={[VRBO_BRAND]} availableBrands={[VRBO_BRAND]} />);
        expect(wrapper.find('.grafana-navigation-blocker')).to.have.length(2);
    });

    it('does not render when invalid brand', () => {
        const wrapper = mount(<GrafanaDashboard selectedBrands={[EXPEDIA_BRAND]} availableBrands={[VRBO_BRAND]} />);
        expect(wrapper.find('.grafana-navigation-blocker')).to.have.length(0);
    });
});