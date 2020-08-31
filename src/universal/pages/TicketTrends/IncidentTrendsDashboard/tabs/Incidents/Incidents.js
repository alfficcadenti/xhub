import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../components/DataTable';
import NoResults from '../../../../../components/NoResults/NoResults';
import {getIncidentsData} from '../../../incidentsHelper';


const renderTable = (filteredIncidents, isPartnerBrand) => {
    const columns = isPartnerBrand
        ? ['Incident', 'Priority', 'Brand', 'Division', 'Started', 'Summary', 'Impacted Partners', 'RC Owner', 'TTD', 'TTR', 'Notification Sent', 'Status']
        : ['Incident', 'Priority', 'Brand', 'Division', 'Started', 'Summary', 'RC Owner', 'TTD', 'TTR', 'Status'];
    const columnsInfo = {
        TTD: <div>{'Time to Detect'}</div>,
        TTR: <div>{'Time to Resolve (Duration)'}</div>
    };
    const csvColumns = columns.concat(['Executive Summary', 'Resolution Notes']);
    return (
        <DataTable
            title={`Incidents (${filteredIncidents.length} results)`}
            info="Refreshes every 15 minutes"
            data={getIncidentsData(filteredIncidents)}
            columns={columns}
            columnsInfo={columnsInfo}
            expandableColumns={['Details']}
            pageSize={25}
            paginated
            csvColumns={csvColumns}
            csvFilename="IncidentsResults.csv"
            enableCSVDownload
        />
    );
};

const Incidents = ({filteredIncidents, isPartnerBrand}) => (
    <div data-wdio="incidents-table">
        {
            filteredIncidents.length
                ? renderTable(filteredIncidents, isPartnerBrand)
                : <NoResults />
        }
    </div>
);

Incidents.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default React.memo(Incidents);
