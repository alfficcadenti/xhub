import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import PageviewWidget from '..';

const data = [
    {label: '1:00 AM', value: 240},
    {label: '2:00 AM', value: 178},
    {label: '3:00 AM', value: 90},
    {label: '4:00 AM', value: 38},
    {label: '5:00 AM', value: 480},
    {label: '6:00 AM', value: 380},
];


describe('LineChart component testing', () => {
    it('checks PageviewWidget component exists', () => {
        const wrapper = shallow(
            <PageviewWidget title={'test'} data={data} brand={'Expedia'} />
        );
        expect(wrapper).to.have.length(1);
    });

    it('checks PageviewWidget create a widget with title if data is empty', () => {
        const wrapper = shallow(
            <PageviewWidget title={'test'} data={[]} brand={'Expedia'} />
        );
        expect(wrapper.find('h3').text()).to.be.eql('test');
    });
});
