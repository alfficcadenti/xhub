import React from 'react';
import {mount, shallow} from 'enzyme';
import chai, {expect} from 'chai';
import chaiJestSnapshot from 'chai-jest-snapshot';
import SavedQuestionnaire from '../index';
import renderer from 'react-test-renderer';
import mockHistory from './mockHistory.json';
chai.use(chaiJestSnapshot);

const history = mockHistory;

describe('<SavedQuestionnaire /> ', () => {
    beforeEach(() => {
        chaiJestSnapshot.setFilename(`${__filename}.snap`);
    });


    it('renders correctly', () => {
        const props = {
            error: '',
            isLoading: false,
            history
        };
        const wrapper = mount(<SavedQuestionnaire {...props} />);
        expect(wrapper).to.have.lengthOf(1);
    });

    it('matches the snapshot', () => {
        const props = {
            error: '',
            isLoading: false,
            history
        };
        chaiJestSnapshot.setTestName('matches the snapshot');
        const wrapper = renderer.create(<SavedQuestionnaire {...props} />);
        expect(wrapper).to.matchSnapshot();
    });

    it('matches the snapshot with only one saved questionnaire', () => {
        const props = {
            error: '',
            isLoading: false,
            history: [history[0]]
        };
        chaiJestSnapshot.setTestName('matches the snapshot with only one saved questionnaire');
        const wrapper = renderer.create(<SavedQuestionnaire {...props} />);
        expect(wrapper).to.matchSnapshot();
    });

    describe('formatRegionsAnswer()', () => {
        it('return a string with only regions true from the region object', () => {
            const props = {
                error: '',
                isLoading: false,
                history: [history[0]]
            };
            const wrapper = shallow(<SavedQuestionnaire {...props} />);
            const instance = wrapper.instance();
            const test = instance.formatRegionsAnswer(history[0].questionnaire.questions[0].value);
            expect(test).to.be.eql('ap-northeast-1');
        });
    });
});