import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import QualityMetrics from '../index';
import {HOTELS_COM_BRAND} from '../../../constants';
import {BrowserRouter as Router} from 'react-router-dom';


jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useHistory: () => ({
            push: jest.fn()
        }),
        useLocation: () => ({
            pathname: '/quality-metrics',
            hash: '',
            search: '',
            state: ''
        }),
    };
});

describe('<QualityMetrics>', () => {
    const location = {pathname: '/quality-metrics/'};
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<Router>
            <QualityMetrics
                selectedBrands={[HOTELS_COM_BRAND]}
                match=""
                history={history}
                location={location}
            />
        </Router>);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders successfully with default portfolio given base url', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders error message with default settings', () => {
        expect(wrapper.find('.no-results')).to.have.length(1);
    });
});
