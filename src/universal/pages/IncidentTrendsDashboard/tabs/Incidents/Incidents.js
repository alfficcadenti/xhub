import React from 'react';
import PropTypes from 'prop-types';

import DataTable from '../../../../components/DataTable/index';
import {getIncidentsData} from '../../incidentsHelper';

const columns = ['Incident', 'Priority', 'Brand', 'Division', 'Started', 'Summary', 'Duration', 'TTD', 'TTR', 'Root Cause Owners', 'Status'];

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

const Incidents = (props) => (
    <div data-wdio="incidents-table">
        {
            props.filteredIncidents.length
                ? renderTable(props.filteredIncidents)
                : renderNoResults()
        }
    </div>
);

Incidents.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Incidents;
