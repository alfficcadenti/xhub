import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../components/DataTable';
import NoResults from '../../../../components/NoResults';
import {EG_BRAND} from '../../../../constants';
import {formatCRData} from '../../crUtils';

const renderTable = (filteredCR = [], selectedBrand = '') => {
    const columns = ['CR Number', 'Description', 'Application', 'Product', 'Business Reason', 'Started', 'Team'];
    if (selectedBrand === EG_BRAND) {
        columns.push('Platform');
    }
    const csvColumns = columns.concat(['Executive Summary', 'Resolution Notes']);
    return (
        <DataTable
            title={`Change Requests (${filteredCR.length} results)`}
            data={formatCRData(filteredCR)}
            columns={columns}
            expandableColumns={['Details']}
            pageSize={25}
            paginated
            csvColumns={csvColumns}
            csvFilename="ChangeRequestsResults.csv"
            enableCSVDownload
        />
    );
};

const ChangeRequests = ({filteredCR, selectedBrand}) => (
    <div data-wdio="cr-table">
        {
            filteredCR.length
                ? renderTable(filteredCR, selectedBrand)
                : <NoResults />
        }
    </div>
);

ChangeRequests.propTypes = {
    filteredCR: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    selectedBrand: PropTypes.string
};

export default React.memo(ChangeRequests);
