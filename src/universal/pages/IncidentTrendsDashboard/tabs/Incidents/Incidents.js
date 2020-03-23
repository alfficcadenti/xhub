import React from 'react';
import PropTypes from 'prop-types';
import DataTableWrapper from './DataTableWrapper/DataTableWrapper';


const renderNoResults = () => (
    <p>{'No Results Found'}</p>
);

const Incidents = ({filteredIncidents}) => (
    <div data-wdio="incidents-table">
        {
            filteredIncidents.length
                ? <DataTableWrapper filteredIncidents={filteredIncidents}/>
                : renderNoResults()
        }
    </div>
);

Incidents.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Incidents;
