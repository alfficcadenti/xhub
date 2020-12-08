import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme/build';
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
        })
    };
});

describe('Annotations component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<Annotations setFilteredAnnotations={jest.fn()} setEnableAnnotations={jest.fn()} productMapping={[]} isMounted={false}/>);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully without props', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders .display-annotations-btn button with wrapper closed by default', () => {
        expect(wrapper.find('.display-annotations-btn')).to.have.length(1);
        expect(wrapper.find('.annotations-wrapper.closed')).to.have.length(1);
    });

    it('open .annotations-wrapper when clicks on .display-annotations-btn', () => {
        wrapper.find('.display-annotations-btn').simulate('click');
        expect(wrapper.find('.annotations-wrapper')).to.have.length(1);
    });
});
