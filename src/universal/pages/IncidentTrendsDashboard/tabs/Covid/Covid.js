import React from 'react';
import PropTypes from 'prop-types';

import DataTable from '../../../../components/DataTable/index';
import {getIncidentsData} from '../../incidentsHelper';

const columns = ['Incident', 'Priority', 'Brand', 'Started', 'Summary', 'Duration', 'TTD', 'TTR', 'Root Cause Owners', 'Status'];

const columnsInfo = {
    Started: (<div><b>{'Started'}</b><br />{'Displayed in browser'}&apos;{'s local time'}</div>)
};

const renderTable = (filteredIncidents) => (
    <DataTable
        data={getIncidentsData(filteredIncidents)}
        columns={columns}
        columnsInfo={columnsInfo}
        paginated
    />
);

const renderNoResults = () => (
    <p>{'No Results Found'}</p>
);

const Covid = ({filteredIncidents}) => (
    <div data-wdio="incidents-table">
        {
            filteredIncidents.length
                ? renderTable(filteredIncidents)
                : renderNoResults()
        }
    </div>
);

Covid.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Covid;
