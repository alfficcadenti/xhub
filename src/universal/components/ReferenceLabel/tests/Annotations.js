import {DEPLOYMENT_ANNOTATION_CATEGORY, AB_TESTS_ANNOTATION_CATEGORY} from '../../../constants';
const annotation1 = {
    brand: 'eCommerce Platform',
    business_justification: 'Automated Deployment',
    business_reason: 'Upgrade',
    category: DEPLOYMENT_ANNOTATION_CATEGORY,
    environment_name: 'Production',
    id: '82a27fdc1bd93c5461db8663cc4bcb75',
    number: 'CHG3982698',
    opened_at: '2021-07-08T15:09:04Z',
    platform: 'Egencia EU,Egencia NA',
    product_name: 'Bookings',
    repo_source: 'https://github.expedia.biz/Egencia/flight-booking-service',
    service_name: 'flight-booking-service',
    service_tier: 'Tier 1',
    short_description: 'flight-booking-service of EGENCIA 71c75b189e was deployed to eu-west-1 in production',
    sys_created_by: 's-brightsnow',
    tags: ['Bookings', 'Egencia EU,Egencia NA'],
    team_contact_dl: 'AirTeamSirocco@expedia.com',
    team_name: 'egencia-air-sirocco',
    time: 1625756944000
};

const annotation2 = {
    abTestDetails: {
        experiment_id: 1,
        experiment_name: 'name',
        status: 'status',
        owner: 'owner',
    },
    brand: 'eCommerce Platform',
    business_justification: 'Automated Deployment',
    business_reason: 'Upgrade',
    category: AB_TESTS_ANNOTATION_CATEGORY,
    environment_name: 'Production',
    id: '82a27fdc1bd93c5461db8663cc4bcb75',
    number: 'CHG3982698',
    opened_at: '2021-07-08T15:09:04Z',
    platform: 'Egencia EU,Egencia NA',
    product_name: 'Bookings',
    repo_source: 'https://github.expedia.biz/Egencia/flight-booking-service',
    service_name: 'flight-booking-service',
    service_tier: 'Tier 1',
    short_description: 'flight-booking-service of EGENCIA 71c75b189e was deployed to eu-west-1 in production',
    sys_created_by: 's-brightsnow',
    tags: ['Bookings', 'Egencia EU,Egencia NA'],
    team_contact_dl: 'AirTeamSirocco@expedia.com',
    team_name: 'egencia-air-sirocco',
    time: 1625756944000
};

const annotation3 = {
    brand: 'eCommerce Platform',
    business_justification: 'Automated Deployment',
    business_reason: 'Upgrade',
    category: '',
    environment_name: 'Production',
    id: '82a27fdc1bd93c5461db8663cc4bcb75',
    number: 'CHG3982698',
    opened_at: '2021-07-08T15:09:04Z',
    platform: 'Egencia EU,Egencia NA',
    product_name: 'Bookings',
    repo_source: 'https://github.expedia.biz/Egencia/flight-booking-service',
    service_name: 'flight-booking-service',
    service_tier: 'Tier 1',
    short_description: 'flight-booking-service of EGENCIA 71c75b189e was deployed to eu-west-1 in production',
    sys_created_by: 's-brightsnow',
    tags: ['Bookings', 'Egencia EU,Egencia NA'],
    team_contact_dl: 'AirTeamSirocco@expedia.com',
    team_name: 'egencia-air-sirocco',
    time: 1625756944000
};

export {annotation1, annotation2, annotation3};