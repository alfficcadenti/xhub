import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../../../components/DataTable/index';
import {getIncidentsData, top5LongestDuration, top5ShortestDuration} from '../../incidentsHelper';

const top5Tablecolumns = ['Incident', 'Priority', 'Summary', 'Root Cause Owners', 'Started', 'Duration'];

const renderTable = (data, columns) => (
    <DataTable
        data={getIncidentsData(data)}
        columns={columns}
        paginated={false}
    />
);

const renderResults = (filteredIncidents) => (
    <div>
        {
            <div id="TopLongestDuration">
                <h3>{'Top 5 Longest Duration Incidents'}</h3>
                {renderTable(top5LongestDuration(filteredIncidents), top5Tablecolumns)}
            </div>
        }
        {
            <div id="TopShortestDuration">
                <h3>{'Top 5 Shortest Duration Incidents'}</h3>
                {renderTable(top5ShortestDuration(filteredIncidents), top5Tablecolumns)}
            </div>
        }
    </div>
);

const renderNoResults = () => (
    <p>{'No Results Found'}</p>
);

const Top5 = (props) => {
    return (<div id="inc-top5-tables">
        {
            props.filteredIncidents.length
                ? renderResults(props.filteredIncidents)
                : renderNoResults()
        }
    </div>
    );
};

Top5.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Top5;
