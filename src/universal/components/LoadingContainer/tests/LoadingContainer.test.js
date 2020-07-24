import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import LoadingContainer from '../';


describe('<LoadingContainer />', () => {
    let wrapper;

    it('renders correctly', () => {
        wrapper = shallow(<LoadingContainer isLoading />);
        expect(wrapper).to.have.length(1);
    });

    it('checks LineChartWrapper component exists', () => {
        wrapper = shallow(<LoadingContainer isLoading={false} />);
        expect(wrapper).to.have.length(1);
        expect(wrapper.find('.LoadingOverlay__li').children()).to.have.length(0);
    });
});
