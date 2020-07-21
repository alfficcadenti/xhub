import React from 'react';
import {shallow} from 'enzyme';
import PageView from '../index';
import {expect} from 'chai';
import {EXPEDIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND} from '../../../constants';

const brands = [EXPEDIA_BRAND, HOTELS_COM_BRAND, VRBO_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND, 'Other'];

describe('<PageView />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<PageView title="title" data={[]} brands={brands}/>);
        expect(wrapper).to.have.length(1);
    });
});
