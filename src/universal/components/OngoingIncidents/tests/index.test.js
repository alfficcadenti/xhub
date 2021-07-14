import React from 'react';
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
                        bookingImpact: 'No Quantifiable Impact',
                        brand: null,
                        degradationOutage: 'Degradation',
                        duration: '11700000',
                        endDate: '2021-07-08 03:23:00.0000000',
                        environment: 'Production',
                        estimatedGrossLoss: null,
                        estimatedOrderLoss: null,
                        estimatedRevenueLoss: null,
                        executiveSummary: null,
                        id: 'INC5689555',
                        impactedBrand: null,
                        labels: [''],
                        lob: null,
                        openDate: '2021-07-08 00:45:43.0000000',
                        priority: '1-Critical',
                        priorityNumber: '1',
                        resolution: '',
                        resolvedDate: null,
                        rootCause: null,
                        rootCauseOwner: null,
                        startDate: '2021-07-08 00:08:00.0000000',
                        status: 'In Progress',
                        summary: 'Egencia EMEA/APAC Call Center Interface (CCI) Degraded',
                        tag: null,
                        timeToDetect: null,
                        timeToResolve: '11700000',
                        url: 'https://expedia.service-now.com/go.do?id=INC5689555',
                    }
                ];
            },
        })
    );

    it('checks OngoingIncidents component exists', () => {
        wrapper = shallow(<OngoingIncidents selectedBrands={[EG_BRAND]} />);
        expect(wrapper).toHaveLength(1);
    });

    it('checks OngoingIncidents has title', () => {
        wrapper = mount(<OngoingIncidents selectedBrands={[EG_BRAND]} />);
        expect(wrapper.find('h2.ongoing-incidents-label').text()).toMatch('Ongoing Incidents');
    });

    it('checks OngoingIncidents renders incidents', () => {
        wrapper = mount(<OngoingIncidents selectedBrands={[EG_BRAND]} />);
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
