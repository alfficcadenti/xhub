import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import ImpulseAverageCountPanel from '../index';

const percentageChangeData = {
    selectedLobs: '',
    weekly: -3.88,
    monthly: 5.65,
    yearly: 'N/A'
};

describe('ImpulseAverageCountPanel component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<ImpulseAverageCountPanel data={percentageChangeData} isLoading={false} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders correct container when there is no errors', () => {
        wrapper.setProps({isLoading: false});
        expect(wrapper.render().find('.percentage-change-container')).to.have.length(1);
    });
});
