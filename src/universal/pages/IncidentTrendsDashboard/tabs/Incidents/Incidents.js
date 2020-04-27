import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../components/DataTable';
import NoResults from '../../../../components/NoResults/NoResults';
import {getIncidentsData} from '../../incidentsHelper';


const renderTable = (filteredIncidents) => {
    const columns = ['Incident', 'Priority', 'Brand', 'Division', 'Started', 'Summary', 'Duration', 'TTD', 'TTR', 'Status'];
    const csvColumns = columns.concat(['Root Cause', 'Executive Summary']);
    return (
        <DataTable
            title={`Incidents (${filteredIncidents.length} results)`}
            info="Refreshes every 15 minutes"
            data={getIncidentsData(filteredIncidents)}
            columns={columns}
            expandableColumns={['Details']}
            csvColumns={csvColumns}
            pageSize={25}
            paginated
            enableCSVDownload
        />
    );
};

const Incidents = ({filteredIncidents}) => (
    <div data-wdio="incidents-table">
        {
            filteredIncidents.length
                ? renderTable(filteredIncidents)
                : <NoResults />
        }
    </div>
);

Incidents.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default React.memo(Incidents);
