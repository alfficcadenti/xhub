import React from 'react';
import PropTypes from 'prop-types';

import DataTable from '../../../../components/DataTable/index';
import h from '../../incidentsHelper';

const columns = ['Brand', 'P1', 'P2', 'Total'];

const renderTable = (filteredIncidents) => (
    <DataTable
        data={h.getIncDataByBrand(filteredIncidents)}
        columns={columns}
        paginated={false}
    />
);

const renderNoResults = () => (
    <p>No Results Found</p>
);

const Overview = (props) => (
        <div data-wdio="incidents-byBrand-table" id="inc-overview-table"> 
            {
                props.filteredIncidents.length
                    ? renderTable(props.filteredIncidents)
                    : renderNoResults()
            }
        </div>
        );

Overview.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Overview;
