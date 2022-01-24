export const AVAILABILITY = [
    {
        'applicationName': 'cars-shopping-service',
        'availabilities': [
            {
                'timestamp': '2021-12-07',
                'availability': 99,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2021-12-06',
                'availability': 99.95,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2021-12-05',
                'availability': '50.999',
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2021-12-04',
                'availability': 99.59,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2021-12-03',
                'availability': 60,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2021-12-02',
                'availability': 99.59,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2021-12-01',
                'availability': 100,
                'requestCount': 1000,
                'errorCount': 1
            }
        ]
    },
    {
        'applicationName': 'flights-shopping-service',
        'availabilities': [
            {
                'timestamp': '2021-12-07',
                'availability': 99.991,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2021-12-06',
                'availability': 99.97,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2021-12-05',
                'availability': 99.992,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2021-12-04',
                // 'availability': 99.8,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2021-12-03',
                'availability': 99.993,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2021-12-02',
                'availability': 59,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2021-12-01',
                'availability': 99.999,
                'requestCount': 1000,
                'errorCount': 1
            }
        ]
    }
];
export const availabilityMockData = () => {
    return AVAILABILITY;
};