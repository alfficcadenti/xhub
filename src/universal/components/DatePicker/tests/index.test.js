import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import {DateRangePicker} from '@homeaway/react-date-pickers';
import DatePicker from '../index';


describe('DatePicker component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <DatePicker handleDateRangeChange={() => {}} handleClearDates={() => {}} />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks DatePicker component exists', () => {
        expect(wrapper).to.have.length(1);
    });

    it('passes default props to the DateRangePicker', () => {
        const props = wrapper.find(DateRangePicker).props();

        expect(props.startDate).to.be.eql('');
        expect(props.endDate).to.be.eql('');
        expect(props.minDate).to.be.eql('');
    });

    it('passes correct props to the DateRangePicker', () => {
        const startDate = (new Date('2020-03-21 12:38:57-05')).toISOString();
        const endDate = (new Date('2020-03-22 09:02:00-05')).toISOString();
        wrapper.setProps({
            startDate,
            endDate
        });
        const props = wrapper.find(DateRangePicker).props();

        expect(props.startDate).to.be.eql(startDate);
        expect(props.endDate).to.be.eql(endDate);
    });
});
