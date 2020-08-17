import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import SLADefinitions from '../Panels/SLADefinitions';

describe('<SLADefinitions>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<SLADefinitions />);
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
