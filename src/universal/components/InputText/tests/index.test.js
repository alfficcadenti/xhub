import React from 'react';
import {mount} from 'enzyme';
import chai, {expect} from 'chai';
import chaiJestSnapshot from 'chai-jest-snapshot';
import InputText from '../index';
import renderer from 'react-test-renderer';
chai.use(chaiJestSnapshot);

describe('<InputText /> ', () => {
    const id = '0';
    const question = '# Availability Zones Deployed to';

    beforeEach(() => {
        chaiJestSnapshot.setFilename(`${__filename}.snap`);
    });

    it('renders correctly', () => {
        const wrapper = mount(<InputText id={id} question={question} />);
        expect(wrapper).to.have.lengthOf(1);
    });

    it('matches the snapshot', () => {
        chaiJestSnapshot.setTestName('matches the snapshot');
        const wrapper = renderer.create(<InputText id={id} question={question} />);
        expect(wrapper).to.matchSnapshot();
    });

    describe('onChange()', () => {
        it('changes the state value when user input text', () => {
            const wrapper = mount(<InputText id={id} question={question} />);
            wrapper.find('textarea').simulate('change', {
                target: {value: 'test'}
            });
            expect(wrapper.state('value')).to.be.eql('test');
        });
    });
});