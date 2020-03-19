import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DataTable from '@homeaway/react-data-table';
import {getIncidentsRowTableData} from '../../incidentsHelper';
import TicketsInfo from './TicketsInfo/TicketsInfo';


class DataTableWrapper extends Component {
    constructor(props) {
        super(props);

        this.dataList = getIncidentsRowTableData(props.filteredIncidents);
        this.dataHeaders = [
            {id: 'incident', name: 'Incident'},
            {id: 'priority', name: 'Priority'},
            {id: 'brand', name: 'Brand'},
            {id: 'started', name: 'Started'},
            {id: 'summary', name: 'Summary'},
            {id: 'duration', name: 'Duration'},
            {id: 'ttd', name: 'TTD'},
            {id: 'ttr', name: 'TTR'},
            {id: 'rootCauseOwners', name: 'Root Cause Owners'},
            {id: 'status', name: 'Status'}
        ];

        this.state = {expandedRows: {}};
        this.onToggleExpand = this.onToggleExpand.bind(this);
    }

    onToggleExpand(data, isExpanded) {
        this.setState((prevState) => ({
            expandedRows: {
                ...prevState.expandedRows,
                [data.id]: isExpanded
            }
        }));
    }

    render() {
        const rows = this.dataList
            .map(({
                id,
                incident,
                priority,
                brand,
                started,
                summary,
                duration,
                ttd,
                ttr,
                rootCauseOwners,
                status
            }) => ({
                id,
                cols: [incident, priority, brand, started, summary, duration, ttd, ttr, rootCauseOwners, status],
                expanded: this.state.expandedRows[id],
                expansion: <TicketsInfo />
            }));

        return (
            <DataTable
                headers={this.dataHeaders}
                rows={rows}
                rowConfig={{expandable: true}}
                onToggleExpand={this.onToggleExpand}
                tableConfig={{compact: true}}
            />
        );
    }
}

const renderNoResults = () => (
    <p>{'No Results Found'}</p>
);

const Incidents = (props) => (
    <div data-wdio="incidents-table">
        {
            props.filteredIncidents.length
                ? <DataTableWrapper filteredIncidents={props.filteredIncidents}/>
                : renderNoResults()
        }
    </div>
);

Incidents.propTypes = {
    filteredIncidents: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Incidents;
