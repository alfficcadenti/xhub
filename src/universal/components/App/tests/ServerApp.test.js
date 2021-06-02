import React from 'react';
import {shallow} from 'enzyme/build';
import ServerApp from '../ServerApp.js';
import {expect} from 'chai';

describe('<ServerApp />', () => {
    const wrapper = shallow(
        <ServerApp />
    );

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
