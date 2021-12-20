export const CHECKOUT_FAILURE_SITES_EXPECTED_DATA = ['www.expedia.com', 'www.travelocity.com'];

export const INCIDENTS_EXPECTED_DATA = [{
    'booking_impact': 'Severe Booking Impact',
    'brand': 'Expedia Services',
    'degradation_outage': 'Degradation',
    'duration': '22',
    'end_date': '2021-10-28 08:50:00.0000000 +00:00',
    'environment': 'Production',
    'estimated_gross_loss': '119508.00',
    'estimated_order_loss': '433',
    'estimated_revenue_loss': '23815.00',
    'executive_summary': null,
    'id': 'INC5965866',
    'impacted_brand': 'Hotels',
    'labels': [
        ''
    ],
    'lob': 'Hotels Merchant',
    'open_date': '2021-10-28 08:35:26.0000000 +00:00',
    'priority': '1-Critical',
    'priority_number': '1',
    'resolution': '',
    'resolved_date': '2021-10-28 12:25:10.0000000 +00:00',
    'root_cause': 'Issue occurred due to a configuration change as part of preparation work in AWS us-east-1 region for a scheduled change CHG4531399 (Whitelister Migration to Palo Alto | hcom-prod-secure 510452650734). Services were restored when support teams rolled back configuration to its original state.\r\n\r\nSimilar in cause to INC5944022 - prep work for EG DNS transition causing impact before significant update steps take place.',
    'root_cause_owner': 'Cloud Foundation',
    'start_date': '2021-10-28 08:28:00.0000000 +00:00',
    'status': 'Done',
    'summary': 'Hotels.com Degraded',
    'time_to_detect': '6',
    'time_to_restore': '22',
    'time_to_know': '16',
    'time_to_fix': '0',
    'application_name': 'whitelister',
    'url': 'https://expedia.service-now.com/go.do?id=INC5965866'}];


