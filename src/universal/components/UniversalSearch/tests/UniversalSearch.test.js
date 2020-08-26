import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import UniversalSearch from '../';

describe('UniversalSearch component testing', () => {
    it('checks UniversalSearch component exists', () => {
        const wrapper = shallow(<UniversalSearch suggestions={[]}/>);
        expect(wrapper).to.have.length(1);
    });
});
