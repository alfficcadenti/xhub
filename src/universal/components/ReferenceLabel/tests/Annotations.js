import {DEPLOYMENT_ANNOTATION_CATEGORY, AB_TESTS_ANNOTATION_CATEGORY} from '../../../constants';
const annotation1 = {
    brand: 'eCommerce Platform',
    businessJustification: 'Automated Deployment',
    businessReason: 'Upgrade',
    category: DEPLOYMENT_ANNOTATION_CATEGORY,
    environmentName: 'Production',
    id: '82a27fdc1bd93c5461db8663cc4bcb75',
    number: 'CHG3982698',
    openedAt: '2021-07-08T15:09:04Z',
    platform: 'Egencia EU,Egencia NA',
    productName: 'Bookings',
    repoSource: 'https://github.expedia.biz/Egencia/flight-booking-service',
    serviceName: 'flight-booking-service',
    serviceTier: 'Tier 1',
    shortDescription: 'flight-booking-service of EGENCIA 71c75b189e was deployed to eu-west-1 in production',
    sysCreatedBy: 's-brightsnow',
    tags: ['Bookings', 'Egencia EU,Egencia NA'],
    teamContactDL: 'AirTeamSirocco@expedia.com',
    teamName: 'egencia-air-sirocco',
    time: 1625756944000
};

const annotation2 = {
    abTestDetails: {
        experimentId: 1,
        experimentName: 'name',
        status: 'status',
        owner: 'owner',
    },
    brand: 'eCommerce Platform',
    businessJustification: 'Automated Deployment',
    businessReason: 'Upgrade',
    category: AB_TESTS_ANNOTATION_CATEGORY,
    environmentName: 'Production',
    id: '82a27fdc1bd93c5461db8663cc4bcb75',
    number: 'CHG3982698',
    openedAt: '2021-07-08T15:09:04Z',
    platform: 'Egencia EU,Egencia NA',
    productName: 'Bookings',
    repoSource: 'https://github.expedia.biz/Egencia/flight-booking-service',
    serviceName: 'flight-booking-service',
    serviceTier: 'Tier 1',
    shortDescription: 'flight-booking-service of EGENCIA 71c75b189e was deployed to eu-west-1 in production',
    sysCreatedBy: 's-brightsnow',
    tags: ['Bookings', 'Egencia EU,Egencia NA'],
    teamContactDL: 'AirTeamSirocco@expedia.com',
    teamName: 'egencia-air-sirocco',
    time: 1625756944000
};

const annotation3 = {
    brand: 'eCommerce Platform',
    businessJustification: 'Automated Deployment',
    businessReason: 'Upgrade',
    category: '',
    environmentName: 'Production',
    id: '82a27fdc1bd93c5461db8663cc4bcb75',
    number: 'CHG3982698',
    openedAt: '2021-07-08T15:09:04Z',
    platform: 'Egencia EU,Egencia NA',
    productName: 'Bookings',
    repoSource: 'https://github.expedia.biz/Egencia/flight-booking-service',
    serviceName: 'flight-booking-service',
    serviceTier: 'Tier 1',
    shortDescription: 'flight-booking-service of EGENCIA 71c75b189e was deployed to eu-west-1 in production',
    sysCreatedBy: 's-brightsnow',
    tags: ['Bookings', 'Egencia EU,Egencia NA'],
    teamContactDL: 'AirTeamSirocco@expedia.com',
    teamName: 'egencia-air-sirocco',
    time: 1625756944000
};

export {annotation1, annotation2, annotation3};