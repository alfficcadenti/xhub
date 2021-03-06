import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme/build';
import DateFilterWrapper from '../DateFiltersWrapper';
import moment from 'moment';

const initialStart = moment().subtract(6, 'hours').startOf('minute');
const initialEnd = moment().endOf('minute');

describe('DateFilterWrapper component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(
            <DateFilterWrapper
                pendingStart={initialStart}
                pendingEnd={initialEnd}
                isFormDisabled={false}
                handleApplyFilters={() => {}}
                handleDatetimeChange={() => {}}
                showTimePicker={false}
            />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully when no props are passed', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders .dates-button', () => {
        expect(wrapper.find('.dates-button')).to.have.length(1);
    });

    it('open .datetime-range-picker-container when clicks on .dates-button and display apply button', () => {
        wrapper.find('.dates-button').simulate('click');
        expect(wrapper.find('.datetime-range-picker-container')).to.have.length(1);
        expect(wrapper.find('.apply-btn')).to.have.length(1);
    });
});
