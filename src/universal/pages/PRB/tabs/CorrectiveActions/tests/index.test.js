import React from 'react';
import {act} from '@testing-library/react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import CorrectiveActions from '../index';


global.fetch = require('node-fetch');
describe('<CorrectiveActions />', () => {
    let wrapper;

    beforeEach(async () => {
        await act(async () => {
            wrapper = mount(<CorrectiveActions />);
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('LoadingContainer should have right props', async () => {
        const props = wrapper.find('LoadingContainer').props();
        expect(props.isLoading).equal(true);
        expect(props.error).equal(null);
    });
});
