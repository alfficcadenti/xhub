import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {shallow, mount} from 'enzyme';
import ResiliencyQuestionnaire from '../index';
import mockProductData from './mockProductList.json';

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
            sinon.stub(instance, 'loadQuestionList');
            instance.selectApplication([testApp]);
            expect(instance.state.application).to.eql(testApp);
        });

        it('calls loadQuestionList with selected application name', async () => {
            const testApp = {name: "distributed-automation-dashboard-web", id: 1753}
            const wrapper = shallow(<ResiliencyQuestionnaire />);
            const instance = wrapper.instance();
            const spy = sinon.stub(instance, 'loadQuestionList');
            instance.selectApplication([testApp]);
            expect(spy.calledOnce).to.be.true;
        });
    })

    describe('InputListComponent with errors', () => {
        
        it('display a div with class alert if productError is not null', async () => {
            const wrapper = mount(<ResiliencyQuestionnaire />);
            wrapper.setState({productError: 'error message'});
            expect(wrapper.find('div.Alert')).to.have.lengthOf(1);
        });
    })
});