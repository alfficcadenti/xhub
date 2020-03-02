/* eslint-disable no-unused-vars */
import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {shallow, mount} from 'enzyme';
import ResiliencyQuestionnaire from '../index';
import QuestionForm from '../QuestionForm';
import History from '../History';
import mockLoBDetails from './mockLoBList.json';
import mockProductData from './mockProductList.json';
import mockAppDetails from './mockAppDetails.json';


import {JSDOM} from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

describe('<ResiliencyQuestionnaire/>', () => {
    sinon.stub(ResiliencyQuestionnaire.prototype, 'componentDidMount');
    const testApp = {name: 'distributed-automation-dashboard-web', id: 1753};
    const testProduct = {name: 'Traffic Engineering', id: 1};
    const tierSelected = ['Tier 1'];

    it('renders successfully', () => {
        const wrapper = shallow(<ResiliencyQuestionnaire />);
        expect(wrapper).to.have.length(1);
    });

    it('renders a div with class SearchableListBase', () => {
        const wrapper = mount(<ResiliencyQuestionnaire />);
        wrapper.setState({lobs: mockLoBDetails.content});
        expect(wrapper.find('div.SearchableListBase')).to.have.lengthOf(1);
    });

    describe('selectLoB', () => {
        it('saves LoB name and id in the state from the first element of the array in input', async () => {
            const testLob = {name: 'Flights', id: 1};
            const wrapper = shallow(<ResiliencyQuestionnaire />);
            const instance = wrapper.instance();
            sinon.stub(instance, 'loadProductList');
            instance.selectLob([testLob]);
            expect(instance.state.lob).to.eql(testLob);
        });

        it('calls loadProductList with selected LoB name', async () => {
            const testLob = {name: 'Flights', id: 1};
            const wrapper = shallow(<ResiliencyQuestionnaire />);
            const instance = wrapper.instance();
            const spy = sinon.stub(instance, 'loadProductList');
            instance.selectLob([testLob]);
            // eslint-disable-next-line no-unused-expressions
            expect(spy.calledOnce).to.be.true;
            // eslint-disable-next-line no-unused-expressions
            expect(spy.withArgs('Flights').calledOnce).to.be.true;
        });
    });

    describe('selectProduct', () => {
        it('saves product name and id in the state from the first element of the array in input', async () => {
            const wrapper = shallow(<ResiliencyQuestionnaire />);
            const instance = wrapper.instance();
            sinon.stub(instance, 'loadApplicationList');
            instance.selectProduct([testProduct]);
            expect(instance.state.product).to.eql(testProduct);
        });

        it('calls loadApplicationList with selected product name', async () => {
            const wrapper = shallow(<ResiliencyQuestionnaire />);
            const instance = wrapper.instance();
            const spy = sinon.stub(instance, 'loadApplicationList');
            instance.selectProduct([testProduct]);
            // eslint-disable-next-line no-unused-expressions
            expect(spy.calledOnce).to.be.true;
            // eslint-disable-next-line no-unused-expressions
            expect(spy.withArgs('Traffic Engineering').calledOnce).to.be.true;
        });
    });

    describe('selectApplication', () => {
        it('saves application name and id in the state from the first element of the array in input', async () => {
            const wrapper = shallow(<ResiliencyQuestionnaire />);
            const instance = wrapper.instance();
            instance.selectApplication([testApp]);
            expect(instance.state.application).to.eql(testApp);
        });
    });

    describe('selectTier', () => {
        it('saves tier in the state', async () => {
            const wrapper = shallow(<ResiliencyQuestionnaire />);
            const instance = wrapper.instance();
            instance.selectTier(tierSelected);
            expect(instance.state.tierFilter).to.eql(tierSelected);
        });
    });

    describe('renderQuestions()', () => {
        it('returns a QuestionForm component with application and product from the state', async () => {
            const wrapper = shallow(<ResiliencyQuestionnaire />);
            const QuestionFormReturn = <QuestionForm application={testApp} product={testProduct} />;
            const instance = wrapper.instance();
            wrapper.setState({application: testApp, product: testProduct});
            const questionsForm = instance.renderQuestions();
            expect(questionsForm).to.be.eql(QuestionFormReturn);
        });
    });

    describe('InputListComponent with errors', () => {
        it('display a div with class alert if lobError is not null', async () => {
            const wrapper = mount(<ResiliencyQuestionnaire />);
            wrapper.setState({lobError: 'error message'});
            expect(wrapper.find('div.Alert')).to.have.lengthOf(1);
        });
    });


    describe('<QuestionForm/>', () => {
        const product = mockAppDetails.product;
        const application = mockAppDetails.application;
        const message = 'this is the message';
        sinon.stub(QuestionForm.prototype, 'componentDidMount');

        it('renders successfully with state.isOpen eql to false', () => {
            const wrapper = shallow(<QuestionForm product={product} application={application}/>);
            expect(wrapper).to.have.length(1);
            // eslint-disable-next-line no-unused-expressions
            expect(wrapper.state(['isOpen'])).to.be.false;
        });

        describe('handleSubmit()', () => {
            it('calls submitQuestionnaire() with args', () => {
                const wrapper = shallow(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                sinon.stub(instance, 'getQuestionnaireAnswers');
                const spy = sinon.stub(instance, 'submitQuestionnaire');
                spy.resolves('Ok');
                instance.handleSubmit();
                // eslint-disable-next-line no-unused-expressions
                expect(spy.calledOnce).to.be.true;
                // eslint-disable-next-line no-unused-expressions
                expect(spy.withArgs(product, application).calledOnce).to.be.true;
            });

            it('calls handleOpen() that open the modal', () => {
                const wrapper = mount(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                sinon.stub(instance, 'getQuestionnaireAnswers');
                const spy = sinon.stub(instance, 'submitQuestionnaire');
                spy.resolves('Ok');
                const handleOpen = sinon.spy(instance, 'handleOpen');
                instance.handleSubmit(message);
                // eslint-disable-next-line no-unused-expressions
                expect(handleOpen.calledOnce).to.be.true;
            });
        });

        describe('displayPostResult(message)', () => {
            it('save the given message in the state.modalMessage', () => {
                const wrapper = shallow(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                instance.displayPostResult(message);
                expect(wrapper.state(['modalMessage'])).to.be.eql(message);
            });
        });

        describe('handleOpen()', () => {
            it('set state.isOpen as true', () => {
                const wrapper = shallow(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                instance.handleOpen();
                // eslint-disable-next-line no-unused-expressions
                expect(wrapper.state(['isOpen'])).to.be.true;
            });
        });

        describe('handleClose()', () => {
            it('set state.isOpen as false and remove modalMessage', () => {
                const wrapper = shallow(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                instance.handleClose();
                // eslint-disable-next-line no-unused-expressions
                expect(wrapper.state(['isOpen'])).to.be.false;
            });
        });

        describe('preSubmit()', () => {
            it('check for errors', () => {
                const wrapper = shallow(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                sinon.stub(instance, 'handleSubmit');
                const checkForErrors = sinon.spy(instance, 'checkForErrors');
                instance.preSubmit();
                // eslint-disable-next-line no-unused-expressions
                expect(checkForErrors.calledOnce).to.be.true;
            });

            it('if errors do not call handleSubmit()', () => {
                const wrapper = shallow(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                const handleSubmit = sinon.stub(instance, 'handleSubmit');
                const checkForErrors = sinon.stub(instance, 'checkForErrors');
                checkForErrors.returns(2);
                instance.preSubmit();
                // eslint-disable-next-line no-unused-expressions
                expect(handleSubmit.calledOnce).to.be.false;
            });

            it('if no errors do call handleSubmit()', () => {
                const wrapper = shallow(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                const handleSubmit = sinon.stub(instance, 'handleSubmit');
                const checkForErrors = sinon.stub(instance, 'checkForErrors');
                checkForErrors.returns(0);
                instance.preSubmit();
                // eslint-disable-next-line no-unused-expressions
                expect(handleSubmit.calledOnce).to.be.true;
            });
        });

        describe('saveRegions()', () => {
            it('save regions option in the state', () => {
                const regions = {
                    'us-west-1': true,
                    'us-east-1': false,
                    'eu-west-1': false,
                    'ap-northeast-1': false,
                    'ap-southeast-1': false,
                    'ap-southeast-2': false,
                    'other': false
                };
                const wrapper = shallow(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                instance.saveRegions({'us-west-1': true});
                expect(wrapper.state('regions')).to.be.eql(regions);
            });
        });
    });

    describe('<History/>', () => {
        sinon.stub(History.prototype, 'componentDidMount');
        const product = mockAppDetails.product;
        const application = mockAppDetails.application;

        it('renders successfully', () => {
            const wrapper = shallow(<History product={product} application={application}/>);
            expect(wrapper).to.have.length(1);
        });

        it('renders error message', () => {
            const wrapper = mount(<History product={product} application={application}/>);
            wrapper.setState({
                historyError: 'No questionnaire submitted previously',
                isLoading: false
            });
            expect(wrapper.find('div.Alert')).to.have.lengthOf(1);
            expect(wrapper.find('div.Alert').text()).to.be.eql('No questionnaire submitted previously');
        });
    });
});

