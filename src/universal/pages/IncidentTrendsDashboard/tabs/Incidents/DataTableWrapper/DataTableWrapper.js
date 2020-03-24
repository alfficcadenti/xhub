import React, {Component} from 'react';
import moment from 'moment';
import {getIncidentsData} from '../../../incidentsHelper';
import ExpandableRow from '../ExpandableRow/ExpandableRow';
import DataTable from '@homeaway/react-data-table';


class DataTableWrapper extends Component {
    constructor(props) {
        super(props);

        this.dataList = getIncidentsData(props.filteredIncidents);
        this.dataHeaders = [
            {id: 'Incident', name: 'Incident'},
            {id: 'Priority', name: 'Priority'},
            {id: 'Brand', name: 'Brand'},
            {id: 'Division', name: 'Division'},
            {id: 'Started', name: 'Started'},
            {id: 'Summary', name: 'Summary'},
            {id: 'Duration', name: 'Duration'},
            {id: 'TTD', name: 'TTD'},
            {id: 'TTR', name: 'TTR'},
            {id: 'Status', name: 'Status'}
        ];
        this.state = {
            expandedRows: {},
            pager: {
                itemsPerPage: 10,
                pageNumber: 1,
                numItems: this.dataList.length
            }
        };

        this.onToggleExpand = this.onToggleExpand.bind(this);
        this.onPageUpdate = this.onPageUpdate.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) { //eslint-disable-line
        this.dataList = getIncidentsData(nextProps.filteredIncidents);
        this.setState({
            expandedRows: {},
            pager: {
                itemsPerPage: 10,
                pageNumber: 1,
                numItems: this.dataList.length
            }
        });
    }

    onToggleExpand(data, isExpanded) {
        this.setState((prevState) => ({
            expandedRows: {
                ...prevState.expandedRows,
                [data.id]: isExpanded
            }
        }));
    }

    onPageUpdate(pageNumber) {
        this.setState({
            pager: {
                ...this.state.pager,
                pageNumber
            }
        });
    }

    render() {
        const startPaginationIndex = (this.state.pager.pageNumber - 1) * this.state.pager.itemsPerPage;
        const endPaginationIndex = startPaginationIndex + this.state.pager.itemsPerPage;

        const rows = this.dataList
            .slice(startPaginationIndex, endPaginationIndex)
            .map(({
                id,
                Incident,
                Priority,
                Brand,
                Division,
                Started,
                Summary,
                Duration,
                TTD,
                TTR,
                'Root Cause Owners': rootCauseOwners,
                Status,
                executiveSummary
            }) => ({
                id,
                cols: [Incident, Priority, Brand, Division, Started, Summary, Duration, TTD, TTR, Status],
                expanded: this.state.expandedRows[id],
                expansion: <ExpandableRow executiveSummary={executiveSummary} rootCauseOwners={rootCauseOwners} />
            }));
        // Sort by Started
        rows.sort((a, b) => moment(b.cols[4]).format('YYYYMMDD') - moment(a.cols[4]).format('YYYYMMDD'));

        const colConfig = {flex: {0: 0.5, 1: 0.5, 2: 0.7, 3: 1, 4: 0.5, 5: 1.3, 6: 0.5, 7: 0.5, 8: 0.5, 9: 0.8, 10: 0.5, 11: 0.5}};

        const viewingPropertyFrom = (this.state.pager.pageNumber - 1) * this.state.pager.itemsPerPage + 1;
        const viewingPropertyTo = Math.min(viewingPropertyFrom + this.state.pager.itemsPerPage - 1, this.state.pager.numItems);

        const pager = {
            ...this.state.pager,
            pageDescription: `Viewing ${viewingPropertyFrom} - ${viewingPropertyTo} of ${this.state.pager.numItems} incidents`
        };

        return (
            <DataTable
                headers={this.dataHeaders}
                rows={rows}
                rowConfig={{expandable: true}}
                onToggleExpand={this.onToggleExpand}
                tableConfig={{compact: true}}
                colConfig={colConfig}
                pager={pager}
                onPageUpdate={this.onPageUpdate}
            />
        );
    }
}

export default DataTableWrapper;