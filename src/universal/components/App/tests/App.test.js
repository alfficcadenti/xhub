import React from 'react';
import {shallow} from 'enzyme/build';
import App from '../App.js';
import {expect} from 'chai';

describe('<App />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<App />);
        expect(wrapper).to.have.length(1);
    });

    it('renders main container successfully', () => {
        const wrapper = shallow(<App />);
        expect(wrapper.find('.main-container')).to.have.length(1);
    });
});
