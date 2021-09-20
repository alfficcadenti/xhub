import React from 'react';
import {mount, shallow} from 'enzyme';
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
        wrapper = shallow(
            <TicketDetailsModal
                isOpen
                onClose={() => {}}
                start={'2021-08-01'}
                end={'2021-09-01'}
                data={{priority: 'P1', org: 'Org', level: 'l1'}}
            />);
        expect(wrapper).toHaveLength(1);
    });

    it('checks fetch is called successfully', () => {
        wrapper = mount(<TicketDetailsModal
            isOpen
            onClose={() => {}}
            start={'2021-08-01'}
            end={'2021-09-01'}
            data={{priority: 'P1', org: 'Org', level: 'l1'}}
        />);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
