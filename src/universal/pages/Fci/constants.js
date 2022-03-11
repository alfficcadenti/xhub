export const DELTA_USERS_TABLE_COLUMNS = [
    'Created',
    'Funnel Step'
];

export const CHECKOUT_FCI_TABLE_COLUMNS = [
    'Created',
    'Session',
    'Trace',
    'Failure',
    'Error Code',
    'Intentional',
    'Site',
    'LOB',
    'TPID',
    'EAPID',
    'SiteID',
    'Device User Agent ID',
    'Category',
    'Comment',
    'Is FCI',
    'Traces'
];

export const LOGIN_FCI_TABLE_COLUMNS = [
    'Created',
    'Session',
    'Source',
    'Message',
    'Trace',
    'Error Name',
    'Error Code',
    'Site',
    'LOB',
    'TPID',
    'EAPID',
    'SiteID',
    'Device User Agent ID'
];

export const LOGIN_FCI_HIDDEN_COLUMNS = [
    'Session',
    'Source',
    'TPID',
    'EAPID',
    'SiteID',
    'Device User Agent ID'
];

export const CHECKOUT_DETAIL_COLUMNS = [
    'Created',
    'Session',
    'Trace',
    'Failure',
    'Error Code',
    'Intentional',
    'Site',
    'LOB',
    'TPID',
    'EAPID',
    'SiteID',
    'Device User Agent ID',
    'Category'
];

export const INCIDENT_COLUMNS = [
    'ID',
    'Priority',
    'Started',
    'Booking Impact',
    'TTD',
    'Environment',
    'TTK',
    'RC Owner',
    'TTF',
    'L1',
    'TTR',

];

export const INCIDENT_COLUMNS_LONG = [
    'Description',
    'Executive Summary',
    'Resolution Notes'
];

export const CHECKOUT_FCI_HIDDEN_COLUMNS = [
    'Session',
    'TPID',
    'EAPID',
    'SiteID',
    'Device User Agent ID'
];

export const COMMENT_TABLE_COLUMNS = [
    'Created',
    'Author',
    'Comment',
    'Is FCI'
];
export const TRACE_TABLE_COLUMNS = [
    'Service',
    'Operation',
    'Error',
    'External Error Code',
    'External Description'
];

export const CATEGORY_OPTION = 'Chart by Category';

export const CODE_OPTION = 'Chart by Error Code';

export const ALL_SITES = 'All Sites';

export const SITES = {
    'Expedia': [
        'www.expedia.com',
        'axtraweb.poweredbygps.com',
        'barcelo.poweredbygps.com',
        'd-travel.poweredbygps.co.jp',
        'euro.expedia.net',
        'expedia.virginaustralia.com',
        'flyswoop.poweredbygps.com',
        'getaway.bjs.com',
        'hawaiian.poweredbygps.co.jp',
        'hawaiian.poweredbygps.com',
        'hawaiian.poweredbygps.com.au',
        'hotels.airnewzealand.com',
        'hotels.airnewzealand.com.au',
        'hotels.airnewzealand.co.nz',
        'iberostarvacations.poweredbygps.com',
        'lacoleccion.poweredbygps.com',
        'meliapackages.poweredbygps.com',
        'packages.bahia-principe.com',
        'riuvacations.poweredbygps.com',
        'taap.expedia.cn',
        'travel.aa.co.nz',
        'travel.ca.hotels.com',
        'travel.chase.com',
        'travel.fr.hotels.com',
        'travel.hotels.com',
        'travel.jp.hotels.com',
        'travel.no.hotels.com',
        'travel.rbcrewards.com',
        'travel.se.hotels.com',
        'travel.uk.hotels.com',
        'vacation.hotwire.com',
        'vacationsbyexcellence.poweredbygps.com',
        'vacationsbymgmresorts.poweredbygps.com',
        'vacations.marriott.com',
        'www.carrentals.com',
        'www.cheaptickets.com',
        'www.ebookers.ch',
        'www.ebookers.com',
        'www.ebookers.de',
        'www.ebookers.fi',
        'www.ebookers.fr',
        'www.ebookers.ie',
        'www.expedia-aarp.com',
        'www.expedia.at',
        'www.expedia.be',
        'www.expedia.ca',
        'www.expedia.ch',
        'www.expedia.co.id',
        'www.expedia.co.in',
        'www.expedia.co.jp',
        'www.expedia.co.kr',
        'www.expedia.com',
        'www.expedia.com.ar',
        'www.expedia.com.au',
        'www.expedia.com.br',
        'www.expedia.com.hk',
        'www.expedia.com.my',
        'www.expedia.com.ph',
        'www.expedia.com.sg',
        'www.expedia.com.tw',
        'www.expedia.com.vn',
        'www.expedia.co.nz',
        'www.expedia.co.th',
        'www.expedia.co.uk',
        'www.expedia.de',
        'www.expedia.dk',
        'www.expedia.es',
        'www.expedia.fi',
        'www.expediafortd.com',
        'www.expedia.fr',
        'www.expedia.ie',
        'www.expedia.it',
        'www.expedia.mx',
        'www.expedia.nl',
        'www.expedia.no',
        'www.expedia.se',
        'www.lastminute.com.au',
        'www.lastminute.co.nz',
        'www.mrjet.se',
        'www.orbitz.com',
        'www.travelocity.ca',
        'www.travelocity.com',
        'www.wotif.com',
        'www.wotif.co.nz'
    ],

    'Expedia Partner Solutions': [
        'travel.chase.com',
        'travel.americanexpress.com',
        'travel.rbcrewards.com'
    ]
};

export const CATEGORIES = [
    'Business Error',
    'CC Supply',
    'Expedia Error',
    'Other',
    'Payment Plan',
    'Payments CC',
    'Payment Vault',
    'Price Change',
    'Price Changes',
    'Invalid CID',
    'Inventory Unavailable',
    'Schedule Change',
    'Supply Error',
    'User Error'
];

export const NAV_LINKS = [
    {id: 'trends', label: 'Trends', href: '/fci'},
    {id: 'search', label: 'Search', href: '/fci'},
    {id: 'deltaUsers', label: 'Delta Users', href: '/fci'}
];

export const FCI_TYPE_LOGIN = 'Login FCIs';

export const FCI_TYPE_CHECKOUT = 'Checkout FCIs';
