const MOCK_TEAMS = [
    'CAMS',
    'CAMSUP',
    'CARTA',
    'CRTR'
];

const MOCK_DISTRIBUTION = [
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

export const agileMockData = (req) => {
    if (req.url.path.includes('teams')) {
        return MOCK_TEAMS;
    }
    if (req.url.path.includes('distribution-of-work')) {
        return MOCK_DISTRIBUTION;
    }
    return [];
};