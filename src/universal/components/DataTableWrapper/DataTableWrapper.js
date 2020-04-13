import React, {Component} from 'react';
import {getIncidentsData, getQualityData} from '../../pages/IncidentTrendsDashboard/incidentsHelper';
import ExpandableRow from './ExpandableRow/ExpandableRow';
import DataTable from '@homeaway/react-data-table';


const incidentsHeaders = [
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
const defectsHeaders = [
    {id: 'Defect', name: 'Defect'},
    {id: 'Priority', name: 'Priority'},
    {id: 'Brand', name: 'Brand'},
    {id: 'Opened', name: 'Opened'},
    {id: 'Resolved', name: 'Resolved'},
    {id: 'Summary', name: 'Summary'},
    {id: 'Project', name: 'Project'},
    {id: 'Duration', name: 'Duration'},
    {id: 'Impacted Brand', name: 'Impacted Brand'},
    {id: 'Status', name: 'Status'}
];

class DataTableWrapper extends Component {
    constructor(props) {
        super(props);

        this.dataList = props.incidentType === 'incidents'
            ? getIncidentsData(props.filteredIncidents)
            : getQualityData(props.filteredIncidents);
        this.dataHeaders = props.incidentType === 'incidents'
            ? incidentsHeaders
            : defectsHeaders;
        this.state = {
            expandedRows: {},
            pager: {
                itemsPerPage: 10,
                pageNumber: 1,
                numItems: this.dataList.length
            },
            sortName: 'Opened',
            sortDirection: 'DESC'
        };

        this.onToggleExpand = this.onToggleExpand.bind(this);
        this.onSortableHeaderClick = this.onSortableHeaderClick.bind(this);
        this.onPageUpdate = this.onPageUpdate.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) { //eslint-disable-line
        this.dataList = nextProps.incidentType === 'incidents'
            ? getIncidentsData(nextProps.filteredIncidents)
            : getQualityData(nextProps.filteredIncidents);

        this.setState({
            expandedRows: {},
            pager: {
                itemsPerPage: 10,
                pageNumber: 1,
                numItems: this.dataList.length
            }
        });
    }

    onSortableHeaderClick(header, direction) {
        this.setState({
            sortName: header.id,
            sortDirection: direction
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
        const {incidentType} = this.props;
        const isIncidentType = incidentType === 'incidents';
        const startPaginationIndex = (this.state.pager.pageNumber - 1) * this.state.pager.itemsPerPage;
        const endPaginationIndex = startPaginationIndex + this.state.pager.itemsPerPage;

        const headers = this.dataHeaders.map((header) => ({
            ...header,
            sorter: header.id === this.state.sortName ? {direction: this.state.sortDirection} : {}
        }));
        const timeDurationColumnIds = isIncidentType
            ? ['Duration', 'TTD', 'TTR']
            : ['Duration'];
        const isTimeDurationColumn = (columnName) => timeDurationColumnIds.includes(columnName);
        const incidentsRowsMap = ({
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
            'Root Cause': rootCause,
            Status,
            executiveSummary
        }) => ({
            id,
            cols: [Incident, Priority, Brand, Division, Started, Summary, Duration, TTD, TTR, Status],
            expanded: this.state.expandedRows[id],
            expansion: <ExpandableRow executiveSummary={executiveSummary} rootCause={rootCause} />
        });
        const defectsRowsMap = ({
            id,
            Defect,
            Priority,
            Brand,
            Opened,
            Resolved,
            Summary,
            Project,
            Duration,
            'Impacted Brand': impactedBrand,
            Status
        }) => ({
            id,
            cols: [Defect, Priority, Brand, Opened, Resolved, Summary, Project, Duration, impactedBrand, Status]
        });
        const rowsMap = isIncidentType ? incidentsRowsMap : defectsRowsMap;
        const rows = this.dataList
            .slice().sort((a, b) => {
                const {sortName, sortDirection} = this.state;
                // eslint-disable-next-line complexity
                const sortLogic = (aItem, bItem) => {
                    const aValue = typeof aItem === 'string' ? aItem.toLowerCase() : aItem;
                    const bValue = typeof bItem === 'string' ? bItem.toLowerCase() : bItem;

                    if (aValue > bValue) {
                        return sortDirection === 'DESC' ? -1 : 1;
                    }

                    if (aValue < bValue) {
                        return sortDirection === 'DESC' ? 1 : -1;
                    }

                    return 0;
                };

                if (isTimeDurationColumn(sortName)) {
                    const timeDurationMap = isIncidentType
                        ? {
                            'Duration': 'rawDuration',
                            'TTD': 'rawTTD',
                            'TTR': 'rawTTR'
                        } : {
                            'Duration': 'rawDuration'
                        };

                    const aRawDuration = Number(a[timeDurationMap[sortName]]);
                    const bRawDuration = Number(b[timeDurationMap[sortName]]);

                    return sortLogic(aRawDuration, bRawDuration);
                } else if (sortName === 'Incident' || sortName === 'Defect') {
                    const aSortName = a[sortName].key;
                    const bSortName = b[sortName].key;

                    return sortLogic(aSortName, bSortName);
                }

                const aSortName = a[sortName];
                const bSortName = b[sortName];

                return sortLogic(aSortName, bSortName);
            })
            .slice(startPaginationIndex, endPaginationIndex)
            .map(rowsMap);

        const incidentsColConfig = {flex: {0: 0.5, 1: 0.5, 2: 0.7, 3: 1, 4: 0.5, 5: 1.3, 6: 0.5, 7: 0.5, 8: 0.5, 9: 0.8, 10: 0.5, 11: 0.5}};
        const defectsColConfig = {flex: {0: 0.5, 1: 0.5, 2: 0.5, 3: 0.5, 4: 0.5, 5: 2, 6: 1, 7: 0.5, 8: 0.8, 9: 0.7}};

        const colConfig = isIncidentType ? incidentsColConfig : defectsColConfig;

        const viewingPropertyFrom = (this.state.pager.pageNumber - 1) * this.state.pager.itemsPerPage + 1;
        const viewingPropertyTo = Math.min(viewingPropertyFrom + this.state.pager.itemsPerPage - 1, this.state.pager.numItems);

        const pager = {
            ...this.state.pager,
            pageDescription: `Viewing ${viewingPropertyFrom} - ${viewingPropertyTo} of ${this.state.pager.numItems} ${isIncidentType ? 'incidents' : 'defects'}`
        };

        return (
            <DataTable
                headers={headers}
                rows={rows}
                rowConfig={{expandable: isIncidentType}}
                onToggleExpand={this.onToggleExpand}
                tableConfig={{compact: true}}
                colConfig={colConfig}
                pager={pager}
                onPageUpdate={this.onPageUpdate}
                onSortableHeaderClick={this.onSortableHeaderClick}
            />
        );
    }
}

export default DataTableWrapper;
