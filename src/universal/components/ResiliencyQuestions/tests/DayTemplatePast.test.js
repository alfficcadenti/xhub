import React from 'react';
import {shallow} from 'enzyme';
import DayTemplatePast from '../DayTemplatePast';


describe('<DayTemplatePast /> ', () => {
    test('renders correctly', () => {
        const props = {
            isPast: true,
            isToday: false,
            dayData: {
                inPast: true
            }
        };
        const wrapper = shallow(<DayTemplatePast {...props} />);

        expect(wrapper).toHaveLength(1);
    });

    describe('Past date', () => {
        const props = {
            isPast: true,
            isToday: false,
            dayData: {}
        };

        test('canClick and canHover return TRUE', () => {
            expect(DayTemplatePast.canClick(props)).toBe(true);
            expect(DayTemplatePast.canHover(props)).toBe(true);
        });
    });

    describe("Today's date", () => {
        const props = {
            isPast: false,
            isToday: true,
            dayData: {}
        };

        test('canClick and canHover return TRUE', () => {
            expect(DayTemplatePast.canClick(props)).toBe(true);
            expect(DayTemplatePast.canHover(props)).toBe(true);
        });
    });

    describe('Future date', () => {
        const props = {
            isPast: false,
            isToday: false,
            dayData: {}
        };

        test('canClick and canHover return FALSE', () => {
            expect(DayTemplatePast.canClick(props)).toBe(false);
            expect(DayTemplatePast.canHover(props)).toBe(false);
        });
    });
});
