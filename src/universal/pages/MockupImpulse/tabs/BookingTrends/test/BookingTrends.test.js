import BookingTrends from '../BookingTrends';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import React from 'react';
import fakeData from './data.test.json';

describe('<BookingTrends />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<BookingTrends data={fakeData}/>);
    });
    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
