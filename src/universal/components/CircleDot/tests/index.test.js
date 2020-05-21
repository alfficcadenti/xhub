import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import CircleDot from '../index';


describe('CircleDot component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<CircleDot />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks CircleDot component exists', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders correct icon when status success', () => {
        wrapper.setProps({status: 'success'});
        expect(wrapper.render().find('[data-id="SVG_CHECK__12"]')).to.have.length(1);
    });

    it('renders correct icon when status warning', () => {
        wrapper.setProps({status: 'warning'});
        expect(wrapper.render().find('[data-id="SVG_ALERT_WARNING__16"]')).to.have.length(1);
    });

    it('renders correct icon when status failed', () => {
        wrapper.setProps({status: 'failed'});
        expect(wrapper.render().find('[data-id="SVG_CLOSE__12"]')).to.have.length(1);
    });

    it('renders correct icon when no status provided', () => {
        expect(wrapper.render().find('[data-id="SVG_CHECK__12"]')).to.have.length(1);
    });
});
