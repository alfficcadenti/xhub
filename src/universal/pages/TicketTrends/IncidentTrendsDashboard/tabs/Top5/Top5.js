import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../../components/DataTable';
import NoResults from '../../../../../components/NoResults';
import {getIncidentsData, sortInDescOrderAndGetTop5, sortInAscOrderAndGetTop5} from '../../../incidentsHelper';

const top5Tablecolumns = ['Incident', 'Priority', 'Summary', 'Root Cause Owner', 'Started', 'Duration'];

const renderTable = (data, columns) => (
    <DataTable
        data={getIncidentsData(data)}
        columns={columns}
        paginated={false}
    />
);

const renderResults = (tickets) => (
    <div>
        {
            <div id="TopLongestDuration">
                <h3>{'Top 5 Longest Duration Incidents'}</h3>
                {renderTable(sortInDescOrderAndGetTop5(tickets, 'duration'), top5Tablecolumns)}
            </div>
        }
        {
            <div id="TopShortestDuration">
                <h3>{'Top 5 Shortest Duration Incidents'}</h3>
                {renderTable(sortInAscOrderAndGetTop5(tickets, 'duration'), top5Tablecolumns)}
            </div>
        }
    </div>
);

const Top5 = (props) => {
    return (<div id="inc-top5-tables">
        {
            props.tickets.length
                ? renderResults(props.tickets)
                : <NoResults />
        }
    </div>
    );
};

Top5.propTypes = {
    tickets: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Top5;
