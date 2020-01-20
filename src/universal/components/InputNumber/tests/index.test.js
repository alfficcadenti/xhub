import React from 'react';
import {mount} from 'enzyme';
import chai, {expect} from 'chai';
import chaiJestSnapshot from 'chai-jest-snapshot';
import InputNumber from '../index';
import renderer from 'react-test-renderer';
chai.use(chaiJestSnapshot);

const questions = [
    {id: 0, question: '# Availability Zones Deployed to', type: 'integer'},
    {id: 1, question: '% Prod Traffic', type: 'integer', range: {min: 0, max: 100}}
];

describe('<InputNumber /> ', () => {
    beforeEach(() => {
        chaiJestSnapshot.setFilename(`${__filename}.snap`);
    });

    it('renders correctly', () => {
        const props = questions[1];
        const wrapper = mount(<InputNumber {...props} />);
        expect(wrapper).to.have.lengthOf(1);
    });

    it('matches the snapshot', () => {
        const props = questions[1];
        chaiJestSnapshot.setTestName('matches the snapshot');
        const wrapper = renderer.create(<InputNumber {...props} />);
        expect(wrapper).to.matchSnapshot();
    });

    it('renders a span.help-block when a value is outside the range', () => {
        const props = questions[1];
        const wrapper = mount(<InputNumber {...props} />);
        const input = wrapper.find('input');
        input.simulate('change', {target: {value: '5000'}});
        expect(wrapper.find('span.help-block').text()).to.includes('Error');
    });

    describe('onlyInteger()', () => {
        it('return true when event.key is a dot', () => {
            const event = {key: '.'};
            const props = questions[1];
            const wrapper = mount(<InputNumber {...props} />);
            expect(wrapper.instance().onlyInteger(event)).to.be.true;
        });

        it('return false when event.key is not a dot', () => {
            const event = {key: 'a'};
            const props = questions[1];
            const wrapper = mount(<InputNumber {...props} />);
            expect(wrapper.instance().onlyInteger(event)).to.be.false;
        });
    });

    describe('onlyPositives()', () => {
        it('return true when event.key is a -', () => {
            const event = {key: '-'};
            const props = questions[1];
            const wrapper = mount(<InputNumber {...props} />);
            expect(wrapper.instance().onlyPositives(event)).to.be.true;
        });

        it('return false when event.key is not a -', () => {
            const event = {key: 'a'};
            const props = questions[1];
            const wrapper = mount(<InputNumber {...props} />);
            expect(wrapper.instance().onlyPositives(event)).to.be.false;
        });
    });

    describe('outsideRange()', () => {
        it('return true when the value in input is within the range of min max in input', () => {
            const value = 555;
            const min = 0;
            const max = 100;
            const props = questions[1];
            const wrapper = mount(<InputNumber {...props} />);
            expect(wrapper.instance().outsideRange(value, min, max)).to.be.true;
        });

        it('return true when the value in input is within the range of min max in input', () => {
            const value = 0;
            const min = 1;
            const max = 100;
            const props = questions[1];
            const wrapper = mount(<InputNumber {...props} />);
            expect(wrapper.instance().outsideRange(value, min, max)).to.be.true;
        });

        it('return false when the value in input is outside the range of min max in input', () => {
            const value = 55;
            const min = 0;
            const max = 100;
            const props = questions[1];
            const wrapper = mount(<InputNumber {...props} />);
            expect(wrapper.instance().outsideRange(value, min, max)).to.be.false;
        });
    });

    describe('decimals()', () => {
        it('return a string with the decimals of a number in input', () => {
            const value = 555.77;
            const props = questions[1];
            const wrapper = mount(<InputNumber {...props} />);
            expect(wrapper.instance().decimals(value)).to.be.eql('77');
        });

        it('return 0 when hte number in input has no decimals', () => {
            const value = 555;
            const props = questions[1];
            const wrapper = mount(<InputNumber {...props} />);
            expect(wrapper.instance().decimals(value)).to.be.eql(0);
        });
    });
});