import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import Annotations from '../Annotations';

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useHistory: jest.fn(),
        useLocation: () => ({
            pathname: '/test',
            hash: '',
            search: '',
            state: ''
        }),
    };
});

describe('Annotations component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<Annotations />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully without props', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders .display-annotations-btn button with wrapper closed by default', () => {
        expect(wrapper.find('.display-annotations-btn')).to.have.length(1);
        expect(wrapper.find('.annotations-wrapper')).to.have.length(0);
    });

    it('open .annotations-wrapper when clicks on .display-annotations-btn', () => {
        wrapper.find('.display-annotations-btn').simulate('click');
        expect(wrapper.find('.annotations-wrapper')).to.have.length(1);
    });

    it('display error message if deploymentAnnotationsError && incidentAnnotationsError && abTestsAnnotationsError are true', () => {
        const wrapperError = mount(<Annotations deploymentAnnotationsError incidentAnnotationsError abTestsAnnotationsError/>);
        wrapperError.find('.display-annotations-btn').simulate('click');
        expect(wrapperError.find('.annotations-wrapper')).to.have.length(1);
        expect(wrapperError.find('p').text()).to.be.eql('An unexpected error has occurred loading the annotations. Try refreshing the page. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.');
    });
});