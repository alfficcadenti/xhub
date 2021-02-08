import React from 'react';
import {expect} from 'chai';
import {shallow, render} from 'enzyme';
import LoadingContainer from '../';


describe('<LoadingContainer />', () => {
    let wrapper;

    it('renders correctly', () => {
        wrapper = shallow(<LoadingContainer isLoading />);
        expect(wrapper).to.have.length(1);
    });

    it('checks LoadingContainer component exists', () => {
        wrapper = shallow(<LoadingContainer isLoading={false} />);
        expect(wrapper).to.have.length(1);
        expect(wrapper.find('.LoadingOverlay__li').children()).to.have.length(0);
    });

    it('renders correctly and display alert message', () => {
        wrapper = render(<LoadingContainer isLoading error={'test'}/>);
        expect(wrapper.text()).to.be.eql('test');
    });

    it('renders correctly and display the standard alert message: Error', () => {
        wrapper = render(<LoadingContainer isLoading error={{ErrorMessage: 'test'}}/>);
        expect(wrapper.text()).to.be.eql('Error');
    });

    it('renders correctly and display the standard alert message: Error', () => {
        wrapper = render(<LoadingContainer isLoading error={[1, 2, 3]}/>);
        expect(wrapper.text()).to.be.eql('Error');
    });
});
