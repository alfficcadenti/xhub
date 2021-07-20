import React from 'react';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';
import LineChartWrapper from '../';
import TooltipContent from '../../../pages/TicketTrends/IncidentTrendsDashboard/tabs/FinancialImpact/TooltipContent';


describe('<LineChartWrapper />', () => {
    let wrapper;

    it('renders correctly', () => {
        wrapper = shallow(<LineChartWrapper data={[{name: 'name', value: 'value'}]} keys={['value']} />);
        expect(wrapper).to.have.length(1);
        expect(wrapper.find('h3').children()).to.have.length(0);
    });

    it('displays a tooltip when active', () => {
        const tooltipData = {
            '2021-06-20': {
                'Egencia': [],
                'Expedia': [
                    {
                        link: '<a href=\"https://expedia.service-now.com/go.do?id=INC5661034\" target=\"_blank\" data-reactroot=\"\">INC5661034</a>',
                        lostRevenue: 843219
                    },
                    {
                        link: '<a href=\"https://expedia.service-now.com/go.do?id=INC5653653\" target=\"_blank\" data-reactroot=\"\">INC5653653</a>',
                        lostRevenue: 62142
                    },
                    {
                        link: '<a href=\"https://expedia.service-now.com/go.do?id=EPM-1002\" target=\"_blank\" data-reactroot=\"\">EPM-1002</a>',
                        lostRevenue: 0
                    },
                    {
                        link: '<a href=\"https://expedia.service-now.com/go.do?id=EPM-1003\" target=\"_blank\" data-reactroot=\"\">EPM-1003</a>',
                        lostRevenue: 0
                    },
                    {
                        link: '<a href=\"https://expedia.service-now.com/go.do?id=EPM-1005\" target=\"_blank\" data-reactroot=\"\">EPM-1005</a>',
                        lostRevenue: 0
                    }],
                'Expedia Group': [],
                'Expedia Partner Solutions': [],
                'Hotels.com': [{
                    link: '<a href=\"https://expedia.service-now.com/go.do?id=INC5652612\" target=\"_blank\" data-reactroot=\"\">INC5652612</a>',
                    lostRevenue: 367080
                }],
                Vrbo: [{
                    link: '<a href=\"https://expedia.service-now.com/go.do?id=INC5660823\" target=\"_blank\" data-reactroot=\"\">INC5660823</a>',
                    lostRevenue: 972046
                }],
            }
        };

        const onMouseDown = () => {};
        const onMouseMove = () => {};
        const onMouseUp = () => {};
        const onDotClick = () => {};
        const payload = [{
            color: '#3366cc',
            dataKey: 'Expedia',
            fill: '#fff',
            formatter: null,
            name: 'Expedia',
            payload: {
                'Egencia': 0,
                'Expedia': 905361,
                'Expedia Group': 0,
                'Expedia Partner Solutions': 0,
                'Hotels.com': 367080,
                'Vrbo': 972046,
                name: '2021-06-20',
            },
            stroke: '#3366cc',
            strokeWidth: 1,
            type: null,
            unit: null,
            value: 0,
        }];

        wrapper = mount(<LineChartWrapper
            width={700}
            height={300}
            title="title" data={[{name: 'name', value: 'value'}]}
            keys={['value']}
            active
            selectedLine="Expedia"
            tooltipData={tooltipData}
            renderTooltipContent={TooltipContent}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
            cursor={onDotClick ? 'pointer' : ''}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            label="2021-06-20"
            payload={payload}
        />);

        expect(wrapper.find('.recharts-tooltip-wrapper')).to.have.length(1);
        expect(wrapper.find('.recharts-legend-wrapper')).to.have.length(1);
        wrapper.find('.recharts-legend-wrapper li').simulate('click');
        expect(wrapper.find('.legend-item-0.inactive')).to.have.length(1);
    });
});
