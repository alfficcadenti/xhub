import React from 'react';
import {mount} from 'enzyme';
import chai, {expect} from 'chai';
import chaiJestSnapshot from 'chai-jest-snapshot';
import InputText from '../index';
import renderer from 'react-test-renderer';
chai.use(chaiJestSnapshot);

const question = [
    {id: 0, question: '# Availability Zones Deployed to'}
]

describe('<InputText /> ', () => {

    beforeEach(function() {
        chaiJestSnapshot.setFilename(__filename + ".snap");
      });

    it('renders correctly', () => {
        const props = question
        const wrapper = mount(<InputText {...props}/>);
        expect(wrapper).to.have.lengthOf(1);
    });

    it('matches the snapshot', () => {
        const props = question;
        chaiJestSnapshot.setTestName("matches the snapshot");
        const wrapper = renderer.create(<InputText {...props}/>);
        expect(wrapper).to.matchSnapshot();
    });

    describe('onChange()', () => {
        it('changes the state value when user input text', () => {
            const props = question
            const wrapper = mount(<InputText {...props}/>);
            wrapper.find('textarea').simulate('change', {
                target: { value: 'test' }
              })
            expect(wrapper.state('value')).to.be.eql('test');
        });
    })
})