import React from 'react';
import {render} from '@testing-library/react';
import HeatMap from '../index';
import {AVAILABILITY} from '../../../../server/routes/api/testData/availability';
import '@testing-library/jest-dom';


describe('<HeatMap />', () => {
    it('renders No Results when data is empty', async () => {
        const wrapper = render(<HeatMap data={[]} dataLabel="availability" yLabel="applicationName" xLabel="timestamp"/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders availability table when data match API sample', async () => {
        const wrapper = render(<HeatMap data={AVAILABILITY} dataLabel="availability" yLabel="applicationName" xLabel="timestamp"/>);
        expect(wrapper).toMatchSnapshot();
    });
});