import React from 'react';
import {shallow} from 'enzyme/build';
import ClientApp from '../ClientApp.js';
import {expect} from 'chai';

describe('<ClientApp />', () => {
    const wrapper = shallow(
        <ClientApp />
    );

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
