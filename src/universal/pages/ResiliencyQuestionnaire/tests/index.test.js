import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {shallow, mount} from 'enzyme';
import ResiliencyQuestionnaire from '../index';
import mockProductData from './mockProductList.json';

describe('<ResiliencyQuestionnaire/>', () => {
    sinon.stub(ResiliencyQuestionnaire.prototype, 'componentDidMount');

    it('renders successfully', () => {
        const wrapper = shallow(<ResiliencyQuestionnaire />);
        expect(wrapper).to.have.length(1);
    });

    it('renders a div with class SearchableListBase', () => {
        const wrapper = mount(<ResiliencyQuestionnaire />);
        wrapper.setState({products: mockProductData.content});
        expect(wrapper.find('div.SearchableListBase')).to.have.lengthOf(1);
    })
});