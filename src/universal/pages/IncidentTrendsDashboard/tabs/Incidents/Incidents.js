import React from 'react';
import PropTypes from 'prop-types';
import DataTableWrapper from '../../../../components/DataTableWrapper/DataTableWrapper';
import HelpText from './../../../../components/HelpText/HelpText';
import NoResults from './../../../../components/NoResults/NoResults';


const renderTable = (filteredIncidents) => (
    <>
        <h3 className="section-header__text">{`Incidents (${filteredIncidents.length} results)`}
            <HelpText text="Refresh every 15 minutes" />
        </h3>
        <DataTableWrapper filteredIncidents={filteredIncidents} incidentType="incidents" />
    </>
);

const Incidents = ({filteredIncidents}) => (
    <div data-wdio="incidents-table">
        {
            filteredIncidents.length
                ? renderTable(filteredIncidents)
                : <NoResults />
        }
    </div>
);

Incidents.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default React.memo(Incidents);
