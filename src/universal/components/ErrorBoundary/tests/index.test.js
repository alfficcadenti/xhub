import React from 'react';
import {shallow} from 'enzyme/build';
import ErrorBoundary from '../index';
import {expect} from 'chai';

describe('<ErrorBoundary />', () => {
    const wrapper = shallow(
        <ErrorBoundary />
    );

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
