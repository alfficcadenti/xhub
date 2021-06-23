import BookingChartByBrand from '../sections/BookingChartGrouped/BookingChartByBrand';
import {render, shallow} from 'enzyme';
import React from 'react';
import chai, {expect} from 'chai';
import chaiJestSnapshot from 'chai-jest-snapshot';
import fakeData from './dataByBrand.test.json';
chai.use(chaiJestSnapshot);

describe('Booking Trend component testing', () => {
    let wrapper;

    beforeEach(() => {
        chaiJestSnapshot.setFilename(`${__filename}.snap`);
        wrapper = shallow(
            <BookingChartByBrand data ={fakeData} />
        );
    });
    afterEach(() => {
        wrapper.unmount();
    });


    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('matches the snapshot', () => {
        chaiJestSnapshot.setTestName('matches the snapshot');
        const wrapper1 = render(<BookingChartByBrand data={fakeData}/>);
        expect(wrapper1).to.matchSnapshot();
    });
});
