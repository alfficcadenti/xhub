/* eslint-disable no-unused-vars */
import React from 'react';
import chai, {expect} from 'chai';
import {shallow, render} from 'enzyme';
import BrandPSRDetails from '../BrandPSRDetails';
import mockData from './data.test.json';
import chaiJestSnapshot from 'chai-jest-snapshot';
import renderer from 'react-test-renderer';
import h from '../psrHelpers';
chai.use(chaiJestSnapshot);

beforeEach(() => {
    chaiJestSnapshot.setFilename(`${__filename}.snap`);
});

describe('<BrandPSRDetails/>', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<BrandPSRDetails />);
        expect(wrapper).to.have.length(1);
    });

    it('matches the snapshot', () => {
        chaiJestSnapshot.setTestName('matches the snapshot');
        const brandData = h.psrDetailsByBrand(mockData, 'egencia');
        const wrapper = render(<BrandPSRDetails data={brandData}/>);
        expect(wrapper).to.matchSnapshot();
    });
});