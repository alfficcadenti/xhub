import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../components/DataTable';
import NoResults from '../../../../../components/NoResults/NoResults';
import {getIncidentsData} from '../../../incidentsHelper';


const renderTable = (filteredIncidents) => {
    const columns = ['Incident', 'Priority', 'Brand', 'Division', 'Started', 'Summary', 'Duration', 'TTD', 'TTR', 'Status'];
    const csvColumns = columns.concat(['Executive Summary', 'Resolution Notes']);
    return (
        <DataTable
            title={`Incidents (${filteredIncidents.length} results)`}
            info="Refreshes every 15 minutes"
            data={getIncidentsData(filteredIncidents)}
            columns={columns}
            columnsInfo={{
                Brand: <div>{'Displaying brand(s) selected by'}<br/>{'dropdown [top right in site header]'}</div>
            }}
            expandableColumns={['Details']}
            pageSize={25}
            paginated
            csvColumns={csvColumns}
            csvFilename="IncidentsResults.csv"
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
