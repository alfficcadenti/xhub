import React from 'react';
import DataTable from '../../../../../components/DataTable';
import NoResults from '../../../../../components/NoResults';
import {getTableColumns, getIncidentsData} from '../../../incidentsHelper';

const renderTable = (tickets, selectedBrand) => {
    const columns = getTableColumns(selectedBrand);
    const columnsInfo = {
        TTD: <div>{'Time to Detect'}</div>,
        TTK: <div>{'Time to Know'}</div>,
        TTF: <div>{'Time to Fix'}</div>,
        TTR: <div>{'Time to Restore'}</div>
    };
    const csvColumns = columns.concat(['Executive Summary', 'Resolution Notes']);
    return (
        <DataTable
            title={`Incidents (${tickets.length} results)`}
            info="Refreshes every 15 minutes"
            data={getIncidentsData(tickets)}
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

const Incidents = ({tickets, selectedBrand}) => (
    <div data-wdio="incidents-table">
        {
            tickets.length
                ? renderTable(tickets, selectedBrand)
                : <NoResults />
        }
    </div>
);

export default React.memo(Incidents);
