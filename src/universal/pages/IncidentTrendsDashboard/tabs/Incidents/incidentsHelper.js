import moment from 'moment';

const getIncidentsData = (filteredIncidents = []) => {
    return Object.values(filteredIncidents).map((inc) => (
        {
            Incident: inc.incident_number,
            Priority: inc.priority || '',
            Brand: inc.Brand || '',
            Started: moment.utc(inc.startedAt).local().format('YYYY-MM-DD HH:mm'),
            Summary: inc.incident_summary || '',
            Duration: inc.duration || '',
            'Root Cause Owners': inc.Root_Cause_Owner || '',
            Status: inc.Status || ''
        }
    ));
};

export default {
    getIncidentsData
};
