import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import TravelerMetricsWidget from '..';

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

    it('checks TravelerMetricsWidget render annotations if data is  empty', () => {
        wrapper.setProps({annotations: []});
        expect(wrapper.find('.recharts-reference-line')).to.have.length(0);
    });
});
