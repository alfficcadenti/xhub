import {shallow} from 'enzyme';
import React from 'react';
import {expect} from 'chai';
import fakeData from './anomalyData.test.json';
import AnomalyDetails from '../sections/AnomalyTable/AnomalyDetails';
describe('Anomaly Table component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<AnomalyDetails data ={fakeData} setAnomalyTableData={jest.fn()}/>);
    });
    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('can close button successfully', () => {
        const button = wrapper.find('.close-button');
        button.simulate('click');
        // eslint-disable-next-line no-unused-expressions
        expect(button).to.be.empty;
    });
});
