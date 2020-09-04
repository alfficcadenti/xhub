import React from 'react';
import DataTable from '../../../../../components/DataTable';
import NoResults from '../../../../../components/NoResults/NoResults';
import {getTableColumns, getIncidentsData} from '../../../incidentsHelper';

const renderTable = (filteredIncidents, selectedBrand) => {
    const columns = getTableColumns(selectedBrand);
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

const Incidents = ({filteredIncidents, selectedBrand}) => (
    <div data-wdio="incidents-table">
        {
            filteredIncidents.length
                ? renderTable(filteredIncidents, selectedBrand)
                : <NoResults />
        }
    </div>
);

export default React.memo(Incidents);
