/* eslint-disable no-unused-vars */
import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {shallow, mount} from 'enzyme';
import PSR from '../index';
import mockData from './data.test.json';

import {JSDOM} from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

describe('<PSR/>', () => {
    sinon.stub(PSR.prototype, 'componentDidMount');

    it('renders successfully', () => {
        const wrapper = shallow(<PSR />);
        expect(wrapper).to.have.length(1);
    });

    it('renders a div per brand', () => {
        const wrapper = shallow(<PSR />);
        wrapper.setState({data: mockData, isLoading: false});
        expect(wrapper.find('div.brandPsr')).to.have.length(2);
    });
});

