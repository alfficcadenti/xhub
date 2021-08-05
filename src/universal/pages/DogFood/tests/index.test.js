import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import DogFood from '../index';
import {BrowserRouter} from 'react-router-dom';
import {VRBO_BRAND} from '../../../constants';
import {mockIssues} from './mockIssue';


describe('<DogFood />', () => {
    let wrapper;
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => {
                return mockIssues;
            },
        })
    );

    beforeEach(() => {
        wrapper = mount(<BrowserRouter>
            <DogFood selectedBrands={[VRBO_BRAND]} />
        </BrowserRouter>);
    });

    afterEach(() => {
        wrapper.unmount();
    });
    it('renders successfully', () => {
        expect(wrapper.find('.dog-food-container')).to.have.lengthOf(1);
    });
});
