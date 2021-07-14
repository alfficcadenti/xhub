import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import OperationalTV from '../index';
import {EG_BRAND} from '../../../constants';
import {BrowserRouter} from 'react-router-dom';


jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useHistory: () => ({
            push: jest.fn(),
        }),
        useLocation: () => ({
            pathname: '/test',
            hash: '',
            search: '',
            state: ''
        }),
    };
});

describe('<OperationalTV />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<OperationalTV selectedBrands={[EG_BRAND]} />);
        expect(wrapper).to.have.length(1);
    });

    it('renders iframe element', () => {
        const wrapper = mount(<BrowserRouter><OperationalTV selectedBrands={[EG_BRAND]} availableBrands={[EG_BRAND]} /></BrowserRouter>);
        expect(wrapper.find('iframe')).to.have.length(1);
    });
});
