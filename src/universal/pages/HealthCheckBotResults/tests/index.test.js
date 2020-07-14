import React from 'react';
import {shallow} from 'enzyme';
import HealthCheckBotResults from '../index';
import {EG_BRAND} from '../../../constants';


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

describe('<HealthCheckBotResults />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<HealthCheckBotResults selectedBrands={[EG_BRAND]} />);
        expect(wrapper).toHaveLength(1);
    });
});
