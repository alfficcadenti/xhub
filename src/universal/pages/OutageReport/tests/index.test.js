import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import OutageReport from '../index';
import {EG_BRAND} from '../../../constants';
import {BrowserRouter} from 'react-router-dom';


describe('<OutageReport />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<OutageReport selectedBrands={[EG_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });

    it('renders iframe element', () => {
        const wrapper = mount(<BrowserRouter><OutageReport selectedBrands={[EG_BRAND]} availableBrands={[EG_BRAND]} /></BrowserRouter>);
        expect(wrapper.find('iframe')).to.have.length(1);
    });
});
