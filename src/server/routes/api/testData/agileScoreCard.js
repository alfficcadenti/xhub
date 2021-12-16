const MOCK_TEAMS = [
    'CAMS',
    'CAMSUP',
    'CARTA',
    'CRTR'
];

export const MOCK_DISTRIBUTION = [
    {
        'type_of_work': 'techInitiatives',
        'ticket_count': 3,
        'ticket_ids': 'EGE-354987,EGE-353467,EGE-353926'
    },
    {
        'type_of_work': 'bau',
        'ticket_count': 10,
        'ticket_ids': 'EGE-354987,EGE-353467,EGE-353926,EGE-353467,EGE-353926,EGE-353467,EGE-353926,EGE-359119,EGE-359119,EGE-359119'
    },
    {
        'type_of_work': 'roadmap',
        'ticket_count': 8,
        'ticket_ids': 'EGE-354987,EGE-353467,EGE-353926,EGE-353467,EGE-353926,EGE-353467,EGE-353926,EGE-359119'
    }
];

export const MOCK_NUMBER_OF_BUGS = [
    {
        'date': '2021-11-01',
        'closed_bugs_count': 51,
        'open_bugs_count': 110,
        'closed_bugs_ticket_ids': [
            'EDECO-12071',
            'LUX-10788'
        ],
        'open_bugs_ticket_ids': [
            'RTS-4057',
            'LEO-15833',
            'LEO-15834',
            'LLAM-1356',
        ]
    },
    {
        'date': '2021-11-02',
        'closed_bugs_count': 40,
        'open_bugs_count': 6,
        'closed_bugs_ticket_ids': [
            'EDECO-12071',
            'LUX-10788'
        ],
        'open_bugs_ticket_ids': [
            'RTS-4057',
            'LEO-15833',
            'LEO-15834',
            'LLAM-1356',
        ]
    },
    {
        'date': '2021-11-03',
        'closed_bugs_count': 90,
        'open_bugs_count': 90,
        'closed_bugs_ticket_ids': [
            'EDECO-12071',
            'LUX-10788'
        ],
        'open_bugs_ticket_ids': [
            'RTS-4057',
            'LEO-15833',
            'LEO-15834',
            'LLAM-1356',
        ]
    }
];
export const agileMockData = (req) => {
    if (req.url.path.includes('teams')) {
        return MOCK_TEAMS;
    }
    if (req.url.path.includes('distribution-work-data')) {
        return MOCK_DISTRIBUTION;
    }
    if (req.url.path.includes('number-of-bugs')) {
        return MOCK_NUMBER_OF_BUGS;
    }
    return [];
};