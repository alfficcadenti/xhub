import React from 'react';
import { mount, shallow } from 'enzyme';
import TicketDetailsModal from '../';


describe('<TicketDetailsModal>', () => {
    let wrapper;

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => {
                return [
                    {
                        booking_impact: 'No Quantifiable Impact',
                        brand: null,
                        degradation_outage: 'Degradation',
                        duration: '11700000'
                    }
                ];
            },
        })
    );

    it('renders successfully', () => {
        wrapper = shallow(<TicketDetailsModal />);
        expect(wrapper).toHaveLength(1);
    });

    it('checks OngoingIncidents renders incidents', () => {
        wrapper = mount(<TicketDetailsModal />);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
