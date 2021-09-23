import React from 'react';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';
import TravelerMetricsWidget from '..';
import {pageViewsMockResults} from '../../../pages/FunnelView/tests/mockResults';
import {mockPageViewsChart, mockPageViewsChartWithMinValues} from '../tests/mockPageViewsChart';

const data = [
    {label: '1:00 AM', value: 240},
    {label: '2:00 AM', value: 178},
    {label: '3:00 AM', value: 90},
    {label: '4:00 AM', value: 38},
    {label: '5:00 AM', value: 480},
    {label: '6:00 AM', value: 380},
];

describe('LineChart component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <TravelerMetricsWidget title={'test'} data={data} brand={'Expedia'} />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks TravelerMetricsWidget component exists', () => {
        expect(wrapper).to.have.length(1);
    });

    it('checks TravelerMetricsWidget create a widget with title if data is empty', () => {
        wrapper.setProps({data: []});
        expect(wrapper.find('h3').text()).to.be.eql('test');
    });

    it('checks TravelerMetricsWidget render annotations if data is empty', () => {
        wrapper.setProps({annotations: []});
        expect(wrapper.find('.recharts-reference-line')).to.have.length(0);
    });

    it('render TravelerMetricsWidget with pageViewsMockData and matchTheSnapshot', () => {
        const handleMouseDown = jest.fn();
        const handleMouseMove = jest.fn();
        const handleMouseUp = jest.fn();
        const chartLeft = jest.fn();
        const chartRight = jest.fn();

        const wrapperWithData = mount(
            <TravelerMetricsWidget
                title={'test'}
                data={pageViewsMockResults[0].aggregatedData}
                key={'expediaTest'}
                brand={'Expedia'}
                tickGap={5}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                chartLeft={chartLeft}
                chartRight={chartRight}
                ResponsiveContainerWidth={100}
                ResponsiveContainerHeight={80}
                annotations={[]}
                selectedLoB={''}
            />
        );

        expect(wrapperWithData.html()).to.be.eql(mockPageViewsChart);
    });
    it('render TravelerMetricsWidget with pageViewsMockData and matchTheSnapshot with minValues', () => {
        const handleMouseDown = jest.fn();
        const handleMouseMove = jest.fn();
        const handleMouseUp = jest.fn();
        const chartLeft = jest.fn();
        const chartRight = jest.fn();

        const wrapperWithData = mount(
            <TravelerMetricsWidget
                title="test"
                data={pageViewsMockResults[0].aggregatedData}
                key="expediaTest"
                brand="Expedia"
                tickGap={5}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                chartLeft={chartLeft}
                chartRight={chartRight}
                ResponsiveContainerWidth={100}
                ResponsiveContainerHeight={80}
                annotations={[]}
                selectedLoB={''}
                minChartValue={1000}
            />
        );

        expect(wrapperWithData.html()).to.be.eql(mockPageViewsChartWithMinValues);
    });
});
