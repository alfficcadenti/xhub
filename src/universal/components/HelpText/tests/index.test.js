import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import HelpText from '../HelpText';

describe('<HelpText /> ', () => {
    const props = {
        text: 'test text'
    };

    it('renders correctly', () => {
        const wrapper = shallow(<HelpText {...props} />);
        expect(wrapper).to.have.lengthOf(1);
    });
});