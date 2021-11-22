

export const ListOfService =
    [{name: 'eg-fci-data-service',
        endpointName: '/v1/checkout-failures/sites',
        expectedResponse: ['www.expedia.com', 'www.travelocity.com'],
        endpoint: '/v1/checkout-failures/sites?from=2021-10-26T16:53:00Z&to=2021-10-26T16:53:06Z',
        status: false}];

export const CHECKOUT_FAILURE_SITES_MOCK_DATA = ['www.expedia.com', 'www.travelocity.com'];
