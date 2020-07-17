import React from 'react';
import {shallow} from 'enzyme';
import LandingPage from '../index';
import {formatCSRData} from '../utils';
import {expect} from 'chai';
import {mockData, expectedVrboFormattedData, garbageData} from './mockData';

const selectedBrands = ['Expedia Group'];
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

describe('<LandingPage />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<LandingPage selectedBrands={selectedBrands}/>);
        expect(wrapper).to.have.length(1);
    });

    it('renders successfully without selectedBrands props passed', () => {
        const wrapper = shallow(<LandingPage />);
        expect(wrapper).to.have.length(1);
    });

    describe('formatCSRData()', () => {
        const expectedEmptyData = [{brandName: 'Vrbo', CSRTrend: []}];

        it('return object with CSRTrend empty array if brand selected but data is not present', () => {
            const data = [];
            const formattedData = formatCSRData(data, ['Vrbo']);
            expect(formattedData).to.be.eql(expectedEmptyData);
        });

        it('formats data from CSR api', () => {
            const formattedData = formatCSRData(mockData, ['Vrbo']);
            expect(formattedData).to.be.eql(expectedVrboFormattedData);
        });

        it('return object with CSRTrend empty array if brand selected but garbage data', () => {
            const formattedData = formatCSRData(garbageData, ['Vrbo']);
            expect(formattedData).to.be.eql(expectedEmptyData);
        });
    });
});
