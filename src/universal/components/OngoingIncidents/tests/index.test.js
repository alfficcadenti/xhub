import React from 'react';
import {act} from 'react-dom/test-utils';
import {mount, shallow} from 'enzyme';
import OngoingIncidents from '../index';
import {EG_BRAND} from '../../../constants';


describe('OngoingIncidents component testing', () => {
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
                        duration: '11700000',
                        end_date: '2021-07-08 03:23:00.0000000',
                        environment: 'Production',
                        estimated_gross_loss: null,
                        estimated_order_loss: null,
                        estimated_revenueLoss: null,
                        executive_summary: null,
                        id: 'INC5689555',
                        impacted_brand: null,
                        labels: [''],
                        lob: null,
                        open_date: '2021-07-08 00:45:43.0000000',
                        priority: '1-Critical',
                        priority_number: '1',
                        resolution: '',
                        resolved_date: null,
                        root_cause: null,
                        root_cause_owner: null,
                        start_date: '2021-07-08 00:08:00.0000000',
                        status: 'In Progress',
                        summary: 'Egencia EMEA/APAC Call Center Interface (CCI) Degraded',
                        tag: null,
                        time_to_detect: null,
                        time_to_restore: '11700000',
                        url: 'https://expedia.service-now.com/go.do?id=INC5689555',
                    }
                ];
            },
        })
    );

    it('checks OngoingIncidents component exists', async () => {
        await (act(async () => {
            wrapper = shallow(<OngoingIncidents selectedBrands={[EG_BRAND]} />);
            expect(wrapper).toHaveLength(1);
        }));
    });

    it('checks OngoingIncidents has title', async () => {
        await (act(async () => {
            wrapper = mount(<OngoingIncidents selectedBrands={[EG_BRAND]} />);
            expect(wrapper.find('h2.ongoing-incidents-label').text()).toMatch('Ongoing Incidents');
        }));
    });

    it('checks OngoingIncidents renders incidents', async () => {
        await (act(async () => {
            wrapper = mount(<OngoingIncidents selectedBrands={[EG_BRAND]} />);
        }));
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
