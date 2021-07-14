import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import ReferenceLabel from '../index';
import {annotation1, annotation2, annotation3} from './Annotations';

describe('ReferenceLabel component testing', () => {
    let wrapper = shallow(
        <ReferenceLabel
            annotation={annotation1}
        />
    );

    it('checks ReferenceLabel component exists', () => {
        expect(wrapper).to.have.length(1);
    });

    it('checks if switch statement returns correct element', () => {
        wrapper.setProps({annotation: annotation2});
        expect(wrapper.render().find('.experiment-link')).to.have.length(1);
        wrapper.setProps({annotation: annotation3});
        expect(wrapper.render().find('.summary')).to.have.length(1);
    });
});
