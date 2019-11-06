import React from 'react';
import {mount} from 'enzyme';
import chai, {expect} from 'chai';
import chaiJestSnapshot from 'chai-jest-snapshot';
import ResiliencyQuestion from '../index';
// import renderer from 'react-test-renderer';
chai.use(chaiJestSnapshot);

const questions = [
    {id: 1, question: 'Regions'},
    {id: 2, question: '#AZs'},
]

// const snapShot = '<div class="loading-container"><div class="resiliency-question form-group floating-label empty"><textarea class="FormTextArea__textarea form-control FormTextArea__textarea--auto-expand" aria-label="Regions" id="Regions" style="max-height: 15em; overflow: hidden; height: 2px;"></textarea><label class="FormTextArea__floating-label" for="Regions">Regions</label></div><div class="resiliency-question form-group floating-label empty"><textarea class="FormTextArea__textarea form-control FormTextArea__textarea--auto-expand" aria-label="#AZs" id="#AZs" style="max-height: 15em; overflow: hidden; height: 2px;"></textarea><label class="FormTextArea__floating-label" for="#AZs">#AZs</label></div></div>';

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

    // it('matches the snapshot', () => {
    //     const props = {
    //         error: '',
    //         isLoading: false,
    //         questions
    //     };
    //     chaiJestSnapshot.setTestName("matches the snapshot");
    //     const wrapper = renderer.create(<ResiliencyQuestion {...props} />);
    //     expect(wrapper).to.matchSnapshot();
    //});
})