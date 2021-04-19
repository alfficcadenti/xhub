import {OPXHUB_SUPPORT_CHANNEL} from '../../constants';

export const FCI_TABLE_COLUMNS = [
    'Created',
    'Session',
    'Trace',
    'Failure',
    'Error Code',
    'Intentional',
    'Site',
    'TPID',
    'EAPID',
    'SiteID',
    'Device User Agent ID',
    'Category',
    'Comment',
    'Is FCI',
    'Traces',
    'Edit'
];
export const FCI_DETAIL_COLUMNS = [
    'Created',
    'Session',
    'Trace',
    'Failure',
    'Error Code',
    'Intentional',
    'Site',
    'TPID',
    'EAPID',
    'SiteID',
    'Device User Agent ID',
    'Category'
];
export const FCI_HIDDEN_TABLE_COLUMNS = [
    'Session',
    'TPID',
    'EAPID',
    'SiteID',
    'Device User Agent ID',
    // 'Comment',
    // 'Is FCI'
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

export const FETCH_FAILED_MSG = 'Failed to retrieve FCI data. Try refreshing the page. '
    + `If the problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`;

export const CATEGORY_OPTION = 'category';
export const CODE_OPTION = 'errorCode';

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
