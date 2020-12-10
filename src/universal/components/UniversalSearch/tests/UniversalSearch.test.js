import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import UniversalSearch from '../';

describe('UniversalSearch component testing', () => {
    it('checks UniversalSearch component mount properly', () => {
        const wrapper = mount(<UniversalSearch suggestions={[]}/>);
        expect(wrapper).to.have.length(1);
    });

    it('checks tokens-container length zero if no default selection is passed', () => {
        const wrapper = mount(<UniversalSearch onFilterChange={jest.fn()} suggestions={[]}/>);
        expect(wrapper.find('.Token')).to.have.length(0);
    });

    it('checks UniversalSearch renders the default tokens selection in input', () => {
        const defaultSelection = [
            {key: 'serviceTier', value: 'Tier 1'},
            {key: 'serviceTier', value: 'Tier 2'}
        ];
        const wrapper = mount(<UniversalSearch suggestions={[]} onFilterChange={jest.fn()} defaultSelection={defaultSelection}/>);
        expect(wrapper.find('.Token')).to.have.length(2);
    });
});
