import React from 'react';
import {shallow} from 'enzyme/build';
import Finder from '../index';
import {EG_BRAND} from '../../../constants';
import {expect} from 'chai';


jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useHistory: jest.fn(),
        useLocation: () => ({
            pathname: '/test',
            hash: '',
            search: '',
            state: ''
        }),
    };
});

describe('<Finder/>', () => {
    const wrapper = shallow(<Finder selectedBrands={[EG_BRAND]} />);

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });

    it('LoadingContainer should have right props', async () => {
        const props = wrapper.find('LoadingContainer').props();
        expect(props.isLoading).to.be.eql(true);
        expect(props.error).to.be.eql('');
    });
});