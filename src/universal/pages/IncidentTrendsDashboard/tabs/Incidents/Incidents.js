import React from 'react';
import PropTypes from 'prop-types';
import DataTableWrapper from './DataTableWrapper/DataTableWrapper';


const renderTable = (filteredIncidents) => (
    <>
        <h3 className="section-header__text">{`Incidents (${filteredIncidents.length} results)`}</h3>
        <DataTableWrapper filteredIncidents={filteredIncidents}/>
    </>
);

const renderNoResults = () => (
    <p>{'No Results Found'}</p>
);

const Incidents = ({filteredIncidents}) => (
    <div data-wdio="incidents-table">
        {
            filteredIncidents.length
                ? renderTable(filteredIncidents)
                : renderNoResults()
        }
    </div>
);

Incidents.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Incidents;
