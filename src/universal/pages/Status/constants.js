import {CHECKOUT_FAILURE_SITES_EXPECTED_DATA, INCIDENTS_EXPECTED_DATA} from './tests/mockData/mockData';

export const LIST_OF_SERVICES =
    [{name: 'eg-fci-data-service',
        endpointName: '/v1/checkout-failures/sites',
        expectedResponse: CHECKOUT_FAILURE_SITES_EXPECTED_DATA,
        endpoint: '/v1/checkout-failures/sites?from=2021-10-26T16:53:00Z&to=2021-10-26T16:53:06Z',
        status: false},
    {name: 'opxhub-data-service',
        endpointName: '/v1/incidents',
        expectedResponse: INCIDENTS_EXPECTED_DATA,
        endpoint: 'v1/incidents?from_datetime=2021-10-28T05:31:00Z&to_datetime=2021-10-28T16:31:00Z',
        status: false}
    ];