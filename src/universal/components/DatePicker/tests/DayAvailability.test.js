import React from 'react';
import {shallow} from 'enzyme';
import DayAvailability from '../DayAvailability';


describe('<DayAvailability /> ', () => {
    test('renders correctly', () => {
        const props = {
            isPast: true,
            isToday: false,
            dayData: {
                inPast: true
            }
        };
        const wrapper = shallow(<DayAvailability {...props} />);

        expect(wrapper).toHaveLength(1);
    });

    describe('Past date', () => {
        const props = {
            isPast: true,
            isToday: false,
            dayData: {}
        };

        test('canClick and canHover return TRUE', () => {
            expect(DayAvailability.canClick(props)).toBe(true);
            expect(DayAvailability.canHover(props)).toBe(true);
        });
    });

    describe("Today's date", () => {
        const props = {
            isPast: false,
            isToday: true,
            dayData: {}
        };

        test('canClick and canHover return TRUE', () => {
            expect(DayAvailability.canClick(props)).toBe(true);
            expect(DayAvailability.canHover(props)).toBe(true);
        });
    });

    describe('Future date', () => {
        const props = {
            isPast: false,
            isToday: false,
            dayData: {}
        };

        test('canClick and canHover return FALSE', () => {
            expect(DayAvailability.canClick(props)).toBe(false);
            expect(DayAvailability.canHover(props)).toBe(false);
        });
    });
});
