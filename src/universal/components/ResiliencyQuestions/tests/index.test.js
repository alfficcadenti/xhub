import React from 'react';
import {mount} from 'enzyme';
import chai, {expect} from 'chai';
import chaiJestSnapshot from 'chai-jest-snapshot';
import ResiliencyQuestion from '../index';
import renderer from 'react-test-renderer';
import moment from 'moment';
chai.use(chaiJestSnapshot);

const questions = [
    {id: 1, question: 'Deployed in Regions', type: 'regions', values: ['us-west-1', 'us-east-1', 'eu-west-1', 'ap-northeast-1', 'ap-southeast-1', 'ap-southeast-2', 'other']},
    {id: 2, question: '# Availability Zones Deployed to', type: 'integer'},
    {id: 3, question: '# Instances Deployed', type: 'integer'},
    {id: 4, question: 'Deployed to Segment?', type: 'category', values: ['True', 'False']},
    {id: 5, question: 'Chaos Monkey Enabled?', type: 'category', values: ['True', 'False']},
    {id: 6, question: 'Auto-Scaling Verified By', type: 'category', values: ['Not Validated', 'Production Observation', 'AWS Console', 'Chaos Monkey', 'Gremlin', 'Other']},
    {id: 7, question: 'Single Points of Failure', type: 'text'},
    {id: 15, question: 'Multi-Region ETA', type: 'date'},
    {id: 16, question: 'Resilient ETA', type: 'date'},
];

const regions = {
    'us-west-1': true,
    'us-east-1': false,
    'eu-west-1': false,
    'ap-northeast-1': false,
    'ap-southeast-1': false,
    'ap-southeast-2': false,
    'other': false
};

describe('<ResiliencyQuestion /> ', () => {
    beforeEach(() => {
        chaiJestSnapshot.setFilename(`${__filename}.snap`);
    });

    const props = {
        error: '',
        isLoading: false,
        questions,
        regions
    };


    it('renders correctly', () => {
        const wrapper = mount(<ResiliencyQuestion {...props} />);
        expect(wrapper).to.have.lengthOf(1);
    });

    it('matches the snapshot', () => {
        chaiJestSnapshot.setTestName('matches the snapshot');
        const wrapper = renderer.create(<ResiliencyQuestion {...props} />);
        expect(wrapper).to.matchSnapshot();
    });

    describe('checkDatesError()', () => {
        it('set error message in the state if Resilient-ETA GT Multi-Region-ETA', () => {
            const state = {
                dates: {
                    'Multi-Region-ETA': moment('2019-12-10').format('YYYY-MM-DD'),
                    'Resilient-ETA': moment('2019-12-09').format('YYYY-MM-DD'),
                },
                errorMsg: ''
            };
            const wrapper = mount(<ResiliencyQuestion {...props} />);
            wrapper.setState(state);
            const instance = wrapper.instance();
            instance.checkDatesError();
            expect(wrapper.state(['errorMsg'])).to.contain('Error');
        });

        it('remove error message in the state if Resilient-ETA is LT Multi-Region-ETA', () => {
            const state = {
                dates: {
                    'Multi-Region-ETA': moment('2019-12-08').format('YYYY-MM-DD'),
                    'Resilient-ETA': moment('2019-12-09').format('YYYY-MM-DD'),
                },
                errorMsg: ''
            };
            const wrapper = mount(<ResiliencyQuestion {...props} />);
            wrapper.setState(state);
            const instance = wrapper.instance();
            instance.checkDatesError();
            expect(wrapper.state(['errorMsg'])).to.be.eql('');
        });
    });
});