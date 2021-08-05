import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import OperationalIos from '../index';
import {EG_BRAND} from '../../../constants';
import {BrowserRouter} from 'react-router-dom';


describe('<OperationalIos />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<OperationalIos selectedBrands={[EG_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });

    it('renders iframe element', () => {
        const wrapper = mount(<BrowserRouter><OperationalIos selectedBrands={[EG_BRAND]} availableBrands={[EG_BRAND]} /></BrowserRouter>);
        expect(wrapper.find('iframe')).to.have.length(1);
    });
});
