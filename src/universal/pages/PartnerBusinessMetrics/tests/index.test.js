import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import PartnerBusinessMetrics from '../index';
import {VRBO_BRAND} from '../../../constants';

describe('<PartnerBusinessMetrics />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<PartnerBusinessMetrics selectedBrands={[VRBO_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });
});
