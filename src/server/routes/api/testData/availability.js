export const AVAILABILITY = [
    {
        'applicationName': 'cars-shopping-service',
        'availabilities': [
            {
                'timestamp': '2022-03-01T00:00:00-08:00',
                'availability': 99.99,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-02T00:00:00-08:00',
                'availability': 99,
                'requestCount': 1000,
                'errorCount': 10
            },
            {
                'timestamp': '2022-03-03T00:00:00-08:00',
                'availability': '50',
                'requestCount': 1000,
                'errorCount': 500
            },
            {
                'timestamp': '2022-03-04T00:00:00-08:00',
                'availability': 99.59,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-05T00:00:00-08:00',
                'availability': 60,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-06T00:00:00-08:00',
                'availability': 99.59,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-07T00:00:00-08:00',
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
                'timestamp': '2022-03-01T00:00:00-08:00',
                'availability': 99.991,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-02T00:00:00-08:00',
                'availability': 99.97,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-03T00:00:00-08:00',
                'availability': 99.992,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-04T00:00:00-08:00'
            },
            {
                'timestamp': '2022-03-05T00:00:00-08:00',
                'availability': 99.993,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-06T00:00:00-08:00',
                'availability': 59,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-07T00:00:00-08:00',
                'availability': 99.999,
                'requestCount': 1000,
                'errorCount': 1
            }
        ]
    },
    {
        'applicationName': 'flights-shopping',
        'availabilities': [
            {
                'timestamp': '2022-03-01T00:00:00-08:00',
                'availability': 0,
                'requestCount': 0,
                'errorCount': 0
            },
            {
                'timestamp': '2022-03-02T00:00:00-08:00',
                'availability': 0,
                'requestCount': 1000,
                'errorCount': 1000
            },
            {
                'timestamp': '2022-03-03T00:00:00-08:00',
                'availability': 99.992,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-04T00:00:00-08:00',
                // 'availability': 99.8,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-05T00:00:00-08:00',
                'availability': 99.993,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-06T00:00:00-08:00',
                'availability': 59,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-07T00:00:00-08:00',
                'availability': 99.999,
                'requestCount': null,
                'errorCount': null
            }
        ]
    },
    {
        'applicationName': 'unknown',
        'availabilities': [
            {
                'timestamp': '2022-03-01T00:00:00-08:00',
                'availability': 0,
                'requestCount': 0,
                'errorCount': 0
            },
            {
                'timestamp': '2022-03-02T00:00:00-08:00',
                'availability': 0,
                'requestCount': 1000,
                'errorCount': 1000
            },
            {
                'timestamp': '2022-03-03T00:00:00-08:00',
                'availability': 99.992,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-04T00:00:00-08:00',
                // 'availability': 99.8,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-05T00:00:00-08:00',
                'availability': 99.993,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-06T00:00:00-08:00',
                'availability': 59,
                'requestCount': 1000,
                'errorCount': 1
            },
            {
                'timestamp': '2022-03-07T00:00:00-08:00',
                'availability': 99.999,
                'requestCount': null,
                'errorCount': null
            }
        ]
    }
];
export const availabilityMockData = () => {
    return AVAILABILITY;
};