

export const ListOfService =
    [{name: 'eg-fci-data-service',
        endpointName: '/v1/checkout-failures/sites',
        expectedResponse: ['www.expedia.com', 'www.travelocity.com'],
        endpoint: '/v1/checkout-failures/sites?from=2021-10-26T16:53:00Z&to=2021-10-26T16:53:06Z',
        status: false},
    {name: 'eg-fci-data-service2',
        endpointName: '/v1/checkout-failures/another',
        expectedResponse: ['www.ebookers.com', 'www.expedia.com', 'www.orbitz.com'],
        endpoint: '/v1/checkout-failures/sites?from=2021-10-20T10:10:00Z&to=2021-10-20T10:10:30Z',
        status: false}];

export const CHECKOUT_FAILURE_SITES_MOCK_DATA = ['www.expedia.com', 'www.travelocity.com'];
