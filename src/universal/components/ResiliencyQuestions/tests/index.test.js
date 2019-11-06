import React from 'react';
import {mount} from 'enzyme';
import chai, {expect} from 'chai';
import chaiJestSnapshot from 'chai-jest-snapshot';
import ResiliencyQuestion from '../index';
import renderer from 'react-test-renderer';
chai.use(chaiJestSnapshot);

const questions = [
    {id: 1, question: 'Regions'},
    {id: 2, question: '#AZs'},
]

describe('<ResiliencyQuestion /> ', () => {

    beforeEach(function() {
        chaiJestSnapshot.setFilename(__filename + ".snap");
      });


    it('renders correctly', () => {
        const props = {
            error: '',
            isLoading: false,
            questions
        };
        const wrapper = mount(<ResiliencyQuestion {...props} />);
        expect(wrapper).to.have.lengthOf(1);
    });

    it('matches the snapshot', () => {
        const props = {
            error: '',
            isLoading: false,
            questions
        };
        chaiJestSnapshot.setTestName("matches the snapshot");
        const wrapper = renderer.create(<ResiliencyQuestion {...props} />);
        expect(wrapper).to.matchSnapshot();
    });
})