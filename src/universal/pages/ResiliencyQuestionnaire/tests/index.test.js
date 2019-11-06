/* eslint-disable no-unused-vars */
import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {shallow, mount} from 'enzyme';
import ResiliencyQuestionnaire from '../index';
import QuestionForm from '../QuestionForm';
import History from '../History';
import mockProductData from './mockProductList.json';
import mockAppDetails from './mockAppDetails.json';


import {JSDOM} from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

describe('<ResiliencyQuestionnaire/>', () => {
    sinon.stub(ResiliencyQuestionnaire.prototype, 'componentDidMount');

    it('renders successfully', () => {
        const wrapper = shallow(<ResiliencyQuestionnaire />);
        expect(wrapper).to.have.length(1);
    });

    it('renders a div with class SearchableListBase', () => {
        const wrapper = mount(<ResiliencyQuestionnaire />);
        wrapper.setState({products: mockProductData.content});
        expect(wrapper.find('div.SearchableListBase')).to.have.lengthOf(1);
    })

    describe('selectProduct', () => {
        
        it('saves product name and id in the state from the first element of the array in input', async () => {
            const testProduct = {name: "Traffic Engineering", id: 1}
            const wrapper = shallow(<ResiliencyQuestionnaire />);
            const instance = wrapper.instance();
            sinon.stub(instance, 'loadApplicationList');
            instance.selectProduct([testProduct]);
            expect(instance.state.product).to.eql(testProduct);
        });

        it('calls loadApplicationList with selected product name', async () => {
            const testProduct = {name: "Traffic Engineering", id: 1}
            const wrapper = shallow(<ResiliencyQuestionnaire />);
            const instance = wrapper.instance();
            const spy = sinon.stub(instance, 'loadApplicationList');
            instance.selectProduct([testProduct]);
            expect(spy.calledOnce).to.be.true;
            expect(spy.withArgs("Traffic Engineering").calledOnce).to.be.true;
        });
    })

    describe('selectApplication', () => {
        
        it('saves application name and id in the state from the first element of the array in input', async () => {
            const testApp = {name: "distributed-automation-dashboard-web", id: 1753}
            const wrapper = shallow(<ResiliencyQuestionnaire />);
            const instance = wrapper.instance();
            instance.selectApplication([testApp]);
            expect(instance.state.application).to.eql(testApp);
        });
    })

    describe('InputListComponent with errors', () => {
        
        it('display a div with class alert if productError is not null', async () => {
            const wrapper = mount(<ResiliencyQuestionnaire />);
            wrapper.setState({productError: 'error message'});
            expect(wrapper.find('div.Alert')).to.have.lengthOf(1);
        });
    })



    describe('<QuestionForm/>', () => {
        sinon.stub(QuestionForm.prototype, 'componentDidMount');
        const product = mockAppDetails.product;
        const application = mockAppDetails.application;
        const message = 'this is the message';

        it('renders successfully with state.isOpen eql to false', () => {
            const wrapper = shallow(<QuestionForm product={product} application={application}/>);
            expect(wrapper).to.have.length(1);
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
                expect(spy.calledOnce).to.be.true;
                expect(spy.withArgs(product,application).calledOnce).to.be.true;
            })
        });

        describe('questionnaireSubmitResult(message)', () => {
            it('save the given message in the state.modalMessage', () => {
                const wrapper = shallow(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                instance.questionnaireSubmitResult(message);
                expect(wrapper.state(['modalMessage'])).to.be.eql(message);
            })

            it('calls handleOpen()', () => {
                const wrapper = mount(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                const spy = sinon.spy(instance, 'handleOpen');
                instance.questionnaireSubmitResult(message);
                expect(spy.calledOnce).to.be.true;
            })
        });

        describe('handleOpen()', () => {
            it('set state.isOpen as true', () => {
                const wrapper = shallow(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                instance.handleOpen();
                expect(wrapper.state(['isOpen'])).to.be.true;
            })
        });

        describe('handleClose()', () => {
            it('set state.isOpen as false and remove modalMessage', () => {
                const wrapper = shallow(<QuestionForm product={product} application={application}/>);
                const instance = wrapper.instance();
                instance.handleClose();
                expect(wrapper.state(['isOpen'])).to.be.false;
            })
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
    });
});

