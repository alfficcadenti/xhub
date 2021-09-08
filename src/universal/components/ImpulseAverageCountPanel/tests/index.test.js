import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import ImpulseAverageCountPanel from '../index';

const percentageChangeData = {
    weekly: [{overall: 0}, {brands: {Vrbo: -10.39, Travelocity: -19.39, Egencia: 178.88, 'CarRentals.com': 5.6}}, {lobs: {Activities: -20.69, Rail: 72.86, Cruise: -23.81, Car: -2.98}}],
    monthly: [{overall: 0}, {brands: {Vrbo: -10.39, Travelocity: -19.39, Egencia: 178.88, 'CarRentals.com': 5.6}}, {lobs: {Activities: -20.69, Rail: 72.86, Cruise: -23.81, Car: -2.98}}],
    yearly: [{overall: 0}, {brands: {Vrbo: -10.39, Travelocity: -19.39, Egencia: 178.88, 'CarRentals.com': 5.6}}, {lobs: {Activities: -20.69, Rail: 72.86, Cruise: -23.81, Car: -2.98}}],
};

describe('ImpulseAverageCountPanel component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<ImpulseAverageCountPanel data={percentageChangeData} activeIndex={1} isLoading={false} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders correct container when there is no errors', () => {
        wrapper.setProps({isLoading: false});
        expect(wrapper.render().find('.percentage-change-card-container')).to.have.length(1);
    });
});
