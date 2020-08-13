exports.data = [
    {
        'id': 'PRB-1',
        'summary': 'INC4154769 - P1 - Egencia Degraded - 2020-03-26',
        'createdDate': '2020-03-26 11:03:00.0000000',
        'resolvedDate': '2020-03-29 12:21:00.0000000',
        'priority': '1-Critical',
        'rootCauseOwner': 'Egencia - Hotel Shopping',
        'rootCauseCategory': ['Architectural'],
        'brandsAffected': 'Egencia EU, Egencia NA',
        'linesOfBusinessImpacted': 'Agency Hotels, Merchant Hotels',
        'owningOrganization': 'Egencia',
        'project': 'Egencia',
        'status': 'Closed',
        'linkedIssues': [
            {
                'id': 'PRB-2',
                'summary': 'INC4154769 - Incident - P1 - Egencia Degraded - 2020-03-26',
                'issueType': 'Incident',
                'status': 'Resolved',
                'assignee': 'Unassigned',
                'linkedIssues': []
            },
            {
                'id': 'PRB-3',
                'summary': 'INC4154769 - Post Mortem',
                'issueType': 'Post Mortem',
                'status': 'Closed',
                'assignee': 'Unassigned',
                'linkedIssues': []
            },
            {
                'id': 'PRB-4',
                'summary': 'INC4154769 - Corrective Action - Reduce Time to Detect',
                'issueType': 'Corrective Action',
                'status': 'Closed',
                'assignee': 'Matt Renfrow',
                'linkedIssues': [{
                    'id': 'OE-5',
                    'summary': 'Setup Datadog dashboards for API Monitoring',
                    'issueType': 'DevTask',
                    'status': 'Open',
                    'assignee': 'Unassigned',
                }]
            },
            {
                'id': 'PRB-5',
                'summary': 'INC4154769 - Corrective Action - Remediate Root Cause3',
                'issueType': 'Corrective Action',
                'status': 'Closed',
                'assignee': 'Matt Renfrow',
                'linkedIssues': [{
                    'id': 'EGE-250906',
                    'summary': 'investigate reduce lpas-availDetail response mapping',
                    'issueType': 'Task',
                    'status': 'Closed',
                    'assignee': 'Unassigned',
                }, {
                    'id': 'EGE-250841',
                    'summary': 'move lpas-d logic after second FreshHops',
                    'issueType': 'Task',
                    'status': 'Released',
                    'assignee': 'Menglei Lei',
                }, {
                    'id': 'EGE-250842',
                    'summary': 'make number of rates to lpas-d in rate endpoint configurable',
                    'issueType': 'Task',
                    'status': 'Released',
                    'assignee': 'Menglei Lei',
                }, {
                    'id': 'EGE-250947',
                    'summary': 'Re-visit fallback value for startup for all the configs in rHTS',
                    'issueType': 'Task',
                    'status': 'Released',
                    'assignee': 'Ruchita Sarawgi',
                }]
            },
            {
                'id': 'PRB-7',
                'summary': 'INC4154769 - Resiliency Validation',
                'issueType': 'Resiliency Validation',
                'status': 'Closed',
                'assignee': 'Unassigned',
                'linkedIssues': []
            },
            {
                'id': 'PRB-8',
                'summary': '	INC4154769 - Post Incident Review',
                'issueType': 'Resiliency Validation',
                'status': 'Closed',
                'assignee': 'Unassigned',
                'linkedIssues': []
            },
            {
                'id': 'PRB-9',
                'summary': '	INC4154769 - Retrospective',
                'issueType': 'Retrospective',
                'status': 'Closed',
                'assignee': 'Unassigned',
                'linkedIssues': []
            },
            {
                'id': 'PRB-14',
                'summary': 'INC4163019 - P1 - Lodging Degraded - 2019-06-05',
                'issueType': 'Incident',
                'status': 'Resolved',
                'assignee': 'Unassigned',
                'linkedIssues': []
            },
            {
                'id': 'PRB-77',
                'summary': 'Vrbo Test Corrective Action',
                'issueType': 'Resiliency Validation',
                'status': 'Closed',
                'assignee': 'Unassigned',
                'linkedIssues': []
            }
        ]
    },
    {
        'id': 'PRB-11',
        'summary': 'INC1234567 - P1 - Vrbo Degraded - 2020-04-01',
        'startDate': '2020-04-01 11:03:00.0000000',
        'createdDate': '2020-04-01 11:31:51.0000000',
        'resolvedDate': '2020-04-01 12:21:00.0000000',
        'priority': '1-Critical',
        'rootCauseOwner': 'EWE - Air Development',
        'rootCauseCategory': null,
        'brandsAffected': [],
        'linesOfBusinessImpacted': '',
        'owningOrganization': 'Egencia',
        'project': 'Vrbo',
        'status': 'Closed',
        'linkedIssues': []
    },
    {
        'id': 'PRB-24',
        'summary': 'INC4154769 - P1 - HCOM Degraded - 2020-03-26',
        'startDate': '2020-03-28 11:03:00.0000000',
        'createdDate': '2020-03-28 11:31:51.0000000',
        'resolvedDate': '2020-03-28 12:21:00.0000000',
        'priority': '1-Critical',
        'rootCauseOwner': 'EWE - Air Development',
        'rootCauseCategory': null,
        'brandsAffected': [],
        'linesOfBusinessImpacted': '',
        'owningOrganization': 'Platform & Marketplaces',
        'project': 'HCOM',
        'status': 'Closed',
        'linkedIssues': [
            {
                'id': 'PRB-25',
                'summary': 'INC4154769 - Incident - P1 - Egencia Degraded - 2020-03-28',
                'issueType': 'Incident',
                'status': 'Resolved',
                'assignee': 'James',
                'linkedIssues': []
            },
            {
                'id': 'PRB-30',
                'summary': 'INC4154769 - Post Mortem',
                'issueType': 'Post Mortem',
                'status': 'Closed',
                'assignee': 'Ivan',
                'linkedIssues': []
            }
        ]
    },
];
