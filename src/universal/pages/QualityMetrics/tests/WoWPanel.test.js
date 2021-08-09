import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import WoWPanel from '../Panels/WoWPanel';

global.fetch = require('node-fetch');

describe('<WoWPanel>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <WoWPanel
                tickets={[]}
            />
        );
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
