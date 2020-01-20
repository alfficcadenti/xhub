/* eslint-disable no-unused-vars */
import React from 'react';
import chai, {expect} from 'chai';
import {shallow} from 'enzyme';
import BrandPSRDetails from '../BrandPSRDetails';
import mockData from './data.test.json';
import chaiJestSnapshot from 'chai-jest-snapshot';
import renderer from 'react-test-renderer';
import h from '../psrHelpers';
chai.use(chaiJestSnapshot);

import {JSDOM} from 'jsdom';

beforeEach(() => {
    chaiJestSnapshot.setFilename(`${__filename}.snap`);
});

describe('<BrandPSRDetails/>', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<BrandPSRDetails />);
        expect(wrapper).to.have.length(1);
    });
});