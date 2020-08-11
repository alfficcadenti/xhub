import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../components/DataTable';
import NoResults from '../../../../components/NoResults/NoResults';
import {formatCRData} from '../../crUtils';


const renderTable = (filteredCR) => {
    const columns = ['CR Number', 'Service Name', 'Product', 'Business Reason', 'Platform', 'Opened', 'Version', 'Team', 'Priority', 'Brand', 'Division'];
    const columnsInfo = {
        Brand: <div>{'Displaying brand(s) selected by'}<br/>{'dropdown [top right in site header]'}</div>,
    };
    const csvColumns = columns.concat(['Executive Summary', 'Resolution Notes']);
    return (
        <DataTable
            title={`Change Requests (${filteredCR.length} results)`}
            info="Refreshes every 15 minutes"
            data={formatCRData(filteredCR)}
            columns={columns}
            columnsInfo={columnsInfo}
            expandableColumns={['Details']}
            pageSize={25}
            paginated
            csvColumns={csvColumns}
            csvFilename="ChangeRequestsResults.csv"
            enableCSVDownload
        />
    );
};

const ChangeRequests = ({filteredCR}) => (
    <div data-wdio="cr-table">
        {
            filteredCR.length
                ? renderTable(filteredCR)
                : <NoResults />
        }
    </div>
);

ChangeRequests.propTypes = {
    filteredCR: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default React.memo(ChangeRequests);
