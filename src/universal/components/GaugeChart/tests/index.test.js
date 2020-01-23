import React from 'react';
import {shallow} from 'enzyme';
import chai, {expect} from 'chai';
import chaiJestSnapshot from 'chai-jest-snapshot';
import GaugeChart from '../index';
import renderer from 'react-test-renderer';

chai.use(chaiJestSnapshot);

describe('<GaugeChart /> ', () => {
    beforeEach(() => {
        chaiJestSnapshot.setFilename(`${__filename}.snap`);
    });

    const props = {
        title: 'title',
        value: 96
    };

    it('renders correctly', () => {
        const wrapper = shallow(<GaugeChart {...props} />);
        expect(wrapper).to.have.lengthOf(1);
    });

    it('matches the snapshot', () => {
        chaiJestSnapshot.setTestName('matches the snapshot');
        const wrapper = renderer.create(<GaugeChart {...props} />);
        expect(wrapper).to.matchSnapshot();
    });
});