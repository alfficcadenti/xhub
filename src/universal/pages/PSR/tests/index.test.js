/* eslint-disable no-unused-vars */
import React from 'react';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import {shallow, mount} from 'enzyme';
import PSR from '../index';
import BrandDailyPSR from '../BrandDailyPSR'
import mockData from './data.test.json';
import chaiJestSnapshot from 'chai-jest-snapshot';
import renderer from 'react-test-renderer';
chai.use(chaiJestSnapshot);

import {JSDOM} from 'jsdom';

beforeEach(function() {
    chaiJestSnapshot.setFilename(__filename + ".snap");
});

describe('<PSR/>', () => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
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

    it('matches the snapshot', () => {
        chaiJestSnapshot.setTestName("matches the snapshot");
        const wrapper = renderer.create(<PSR />);
        expect(wrapper).to.matchSnapshot();
    });
});

describe('<BrandDailyPSR/>', () => {
    const spy = sinon.spy();        
    const props = {
        key: 'vrboPSRComponent',
        brand: 'vrbo',
        dailyPSRValue: 98,
        date: '2019-01-01',
        onClick: spy,
        selected: true
    };

    it('renders successfully', () => {
        const wrapper = shallow(<BrandDailyPSR />);
        expect(wrapper).to.have.length(1);
    });

    it('renders a div.brandPsr', () => {
        const wrapper = shallow(<BrandDailyPSR {...props} />);
        wrapper.setState({isOpen: true});
        expect(wrapper.find('div.brandPsr')).to.have.length(1);
    });

    it('onClick trigger the func on props', () => {
        const wrapper = shallow(<BrandDailyPSR {...props} />);
        wrapper.setState({isOpen: true});
        wrapper.find('div.brandPsr').simulate('click')
        expect(spy.calledOnce).to.be.true;
    });

    it('matches the snapshot', () => {
        chaiJestSnapshot.setTestName("matches the snapshot");
        const wrapper = renderer.create(<BrandDailyPSR {...props} />);
        expect(wrapper).to.matchSnapshot();
    });
});