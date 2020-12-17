import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../components/DataTable';
import NoResults from '../../../../components/NoResults';
import {formatABTestsData} from '../../crUtils';

const renderTable = (abTests = []) => {
    const columns = ['A/B Tests Number', 'Description', 'Application', 'Business Reason', 'Started'];
    /* eslint-disable no-unused-expressions */

    const csvColumns = columns.concat(['Executive Summary', 'Resolution Notes']);
    return (
        <DataTable
            title={`A/B Tests (${abTests.length} results)`}
            data={formatABTestsData(abTests)}
            columns={columns}
            expandableColumns={['Details']}
            pageSize={25}
            paginated
            csvColumns={csvColumns}
            csvFilename="ABTestsResults.csv"
            enableCSVDownload
        />
    );
};

const ABTests = ({filteredABTests, selectedBrand}) => (
    <div data-wdio="cr-table">
        {
            filteredABTests.length
                ? renderTable(filteredABTests, selectedBrand)
                : <NoResults />
        }
    </div>
);

ABTests.propTypes = {
    filteredABTests: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default React.memo(ABTests);
