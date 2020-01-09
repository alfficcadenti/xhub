/* eslint-disable no-unused-vars */
import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {shallow, mount} from 'enzyme';
import PSR from '../index';
import BrandDailyPSR from '../BrandDailyPSR'
import BrandPSRDetails from '../BrandPSRDetails'
import mockData from './data.test.json';

const mockDetails = [{
    "date": "2019-12-06",
    "brand": "egencia",
    "successPercentage": 84.0,
    "interval": "daily", 
    "lineofbusiness": "PSR"
  },
  {
    "date": "2019-12-06",
    "brand": "egencia",
    "successPercentage": 82.7,
    "interval": "monthly", 
    "lineofbusiness": "PSR Hotel"
  },
  {
    "date": "2019-12-06",
    "brand": "egencia",
    "successPercentage": 85.0,
    "interval": "weekly", 
    "lineofbusiness": "PSR Flights"
  }]

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
        const wrapper = mount(<PSR />);
        wrapper.setState({data: mockData, isLoading: false});
        expect(wrapper.find('div.brandPsr')).to.have.length(2);
    });
});

describe('<BrandDailyPSR/>', () => {
    const spy = sinon.spy();        
    const props = {
        key: 'vrboPSRComponent',
        brand: 'vrbo',
        dailyPSRValue: 98,
        date: '2019-01-01',
        onClick: spy
    };

    it('renders successfully', () => {
        const wrapper = shallow(<BrandDailyPSR />);
        expect(wrapper).to.have.length(1);
    });

    it('renders a div.brandPsr', () => {
        const wrapper = shallow(<BrandDailyPSR  {...props} />);
        wrapper.setState({isOpen: true});
        expect(wrapper.find('div.brandPsr')).to.have.length(1);
    });

    it('onClick trigger the func on props', () => {
        const wrapper = shallow(<BrandDailyPSR  {...props} />);
        wrapper.setState({isOpen: true});
        wrapper.find('div.brandPsr').simulate('click')
        expect(spy.calledOnce).to.be.true;
    });
});

describe('<BrandPSRDetails/>', () => {
    it('renders successfully the values for the different intervals', () => {
        const wrapper = shallow(<BrandPSRDetails data={mockDetails}/>);
        expect(wrapper.find('span#dailyPSR').text()).to.be.eql('84 %');
        expect(wrapper.find('span#weeklyPSR-Flights').text()).to.be.eql('85 %');
        expect(wrapper.find('span#monthlyPSR-Hotel').text()).to.be.eql('82.7 %');
    });
});