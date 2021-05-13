import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme/build';
import TooltipContent from '../TooltipContent';


describe('FinancialImpact component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <TooltipContent link={'link'} lostRevenue={'100.52'} />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
