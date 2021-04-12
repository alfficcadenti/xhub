import React from 'react';
import {shallow} from 'enzyme/build';
import FciModal from '../index';
import {expect} from 'chai';

describe('<Fci/>', () => {
    const wrapper = shallow(
        <FciModal
            fci={{}}
            fcis={[]}
            editMode
            isOpen
            onEditBack={() => {}}
            onClose={() => {}}
            onSaveComment={() => {}}
            isLoading
            error={null}
        />
    );

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});