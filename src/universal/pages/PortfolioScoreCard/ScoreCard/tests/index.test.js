import React from 'react';
import {mount, shallow} from 'enzyme';
import ScoreCard from '../index';
import {EG_BRAND} from '../../../../constants';
import TicketDetailsModal from '../../TicketDetailsModal';


describe('<ScoreCard />', () => {
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
        wrapper = shallow(<ScoreCard selectedBrands={[EG_BRAND]} />);
        expect(wrapper).toHaveLength(1);
    });

    it('checks fetch is called successfully', () => {
        wrapper = mount(<TicketDetailsModal />);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
