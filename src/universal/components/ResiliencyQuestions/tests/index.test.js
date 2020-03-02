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
    {id: 17, question: 'Last-Rollback-Date', type: 'date'},
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

const lastQuestionnaire = [{key: 'Deployed in Regions', value: 'us-west-1,us-east-1'},
    {key: '# Availability Zones Deployed to', value: '2'},
    {key: '# Instances Deployed', value: '5'},
    {key: 'Deployed to Segment?', value: 'True'},
    {key: 'Chaos Monkey Enabled?', value: ''},
    {key: 'Auto-Scaling Verified By', value: 'Production Observation'},
    {key: 'Single Points of Failure', value: ''},
    {key: 'Golden Indicator  - Latency', value: ''},
    {key: 'Golden Indicator  - Traffic', value: ''},
    {key: 'Golden Indicator  - Errors', value: ''},
    {key: 'Golden Indicator  - Saturation', value: ''},
    {key: '% Prod Traffic', value: '34'},
    {key: '$ Revenue Loss (per minute)', value: '10'},
    {key: '$ GBV Loss (per minute)', value: '19'},
    {key: 'Multi-Region ETA', value: '2/29/2020'},
    {key: 'Resilient ETA', value: '3/11/2020'},
    {key: 'Pipeline Leadtime (minutes)', value: '5'},
    {key: 'Release Cadence (per week)', value: '4'},
    {key: 'Release Confirmation Time (minutes)', value: ''},
    {key: 'Rollback Time (minutes)', value: '3'},
    {key: 'Last Rollback Date', value: '4/11/2020'},
    {key: '% Release Success', value: '100'},
    {key: 'Circuit Breakers', value: 'test'},
    {key: 'Throttling', value: ''},
    {key: 'Notes', value: 'test auto fill'}
];

const lastQuestionnaireEmpty = [{key: 'Deployed in Regions', value: ''},
    {key: '# Availability Zones Deployed to', value: ''},
    {key: '# Instances Deployed', value: ''},
    {key: 'Deployed to Segment?', value: ''},
    {key: 'Chaos Monkey Enabled?', value: ''},
    {key: 'Auto-Scaling Verified By', value: ''},
    {key: 'Single Points of Failure', value: ''},
    {key: 'Golden Indicator  - Latency', value: ''},
    {key: 'Golden Indicator  - Traffic', value: ''},
    {key: 'Golden Indicator  - Errors', value: ''},
    {key: 'Golden Indicator  - Saturation', value: ''},
    {key: '% Prod Traffic', value: ''},
    {key: '$ Revenue Loss (per minute)', value: ''},
    {key: '$ GBV Loss (per minute)', value: ''},
    {key: 'Multi-Region ETA', value: ''},
    {key: 'Resilient ETA', value: ''},
    {key: 'Pipeline Leadtime (minutes)', value: ''},
    {key: 'Release Cadence (per week)', value: ''},
    {key: 'Release Confirmation Time (minutes)', value: ''},
    {key: 'Rollback Time (minutes)', value: ''},
    {key: 'Last Rollback Date', value: ''},
    {key: '% Release Success', value: ''},
    {key: 'Circuit Breakers', value: ''},
    {key: 'Throttling', value: ''},
    {key: 'Notes', value: ''}
];

describe('<ResiliencyQuestion /> ', () => {
    beforeEach(() => {
        chaiJestSnapshot.setFilename(`${__filename}.snap`);
    });

    const props = {
        error: '',
        isLoading: false,
        questions,
        regions,
        lastQuestionnaire
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

    it('matches the snapshot with empty last questionnaire', () => {
        const propsEmpty = {
            error: '',
            isLoading: false,
            questions,
            regions,
            lastQuestionnaireEmpty
        };
        chaiJestSnapshot.setTestName('matches the snapshot');
        const wrapper = renderer.create(<ResiliencyQuestion {...propsEmpty} />);
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

    describe('renderCategoryQuestion()', () => {
        it('render a Searchable list with empty default value when nothing is passed', () => {
            const propsEmpty = {
                error: '',
                isLoading: false,
                questions,
                regions,
                lastQuestionnaireEmpty
            };
            const {id, question, values} = questions[3];
            const wrapper = mount(<ResiliencyQuestion {...propsEmpty} />);
            const instance = wrapper.instance();
            instance.renderCategoryQuestion(id, question, values);
            expect(wrapper.find('.SearchListInput').at(0).text()).to.be.eql('Deployed to Segment?No items selected');
        });
    });
});