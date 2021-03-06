import React from 'react';
import DataTable from '../../../../../components/DataTable';
import NoResults from '../../../../../components/NoResults';
import {getTableColumns, getIncidentsData} from '../../../incidentsHelper';

const renderTable = (tickets, selectedBrand) => {
    const columns = getTableColumns(selectedBrand);
    const columnsInfo = {
        TTD: <div>{'Time to Detect: target <=15m'}</div>,
        TTK: <div>{'Time to Know: target <=30m'}</div>,
        TTF: <div>{'Time to Fix: target <=15m'}</div>,
        TTR: <div>{'Time to Restore: target <=60m'}</div>
    };
    const csvColumns = columns.filter((c) => !['Success Rates', 'Page Views'].includes(c)).concat(['Executive Summary', 'Resolution Notes']);
    return (
        <DataTable
            title={`Incidents (${tickets.length} results)`}
            info="Refreshes every 15 minutes"
            data={getIncidentsData(tickets)}
            columns={columns}
            hiddenColumns={['Success Rates', 'Page Views']}
            columnsInfo={columnsInfo}
            expandableColumns={['Details']}
            pageSize={25}
            paginated
            csvColumns={csvColumns}
            csvFilename="IncidentsResults.csv"
            enableCSVDownload
            enableColumnDisplaySettings
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
