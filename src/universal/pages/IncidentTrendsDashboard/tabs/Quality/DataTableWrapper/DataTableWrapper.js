import React, {Component} from 'react';
import {getQualityData} from '../../../incidentsHelper';
import DataTable from '@homeaway/react-data-table';


class DataTableWrapper extends Component {
    constructor(props) {
        super(props);

        this.dataList = getQualityData(props.filteredIncidents);
        this.dataHeaders = [
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
        this.state = {
            pager: {
                itemsPerPage: 10,
                pageNumber: 1,
                numItems: this.dataList.length
            },
            sortName: 'Opened',
            sortDirection: 'DESC'
        };

        this.onSortableHeaderClick = this.onSortableHeaderClick.bind(this);
        this.onPageUpdate = this.onPageUpdate.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) { //eslint-disable-line
        this.dataList = getQualityData(nextProps.filteredIncidents);
        this.setState({
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

        const headers = this.dataHeaders.map((header) => ({
            ...header,
            sorter: header.id === this.state.sortName ? {direction: this.state.sortDirection} : {}
        }));
        const timeDurationColumnIds = ['Duration'];
        const isTimeDurationColumn = (columnName) => timeDurationColumnIds.includes(columnName);

        const rows = this.dataList
            .slice().sort((a, b) => {
                const {sortName, sortDirection} = this.state;
                const sortLogic = (aItem, bItem) => {
                    const aValue = typeof aItem === 'string' ? aItem.toLowerCase() : aItem;
                    const bValue = typeof bItem === 'string' ? bItem.toLowerCase() : bItem;
                    return sortDirection === 'DESC'
                        ? aValue - bValue
                        : bValue - aValue;
                };

                if (isTimeDurationColumn(sortName)) {
                    const timeDurationMap = {
                        'Duration': 'rawDuration'
                    };
                    const aRawDuration = Number(a[timeDurationMap[sortName]]);
                    const bRawDuration = Number(b[timeDurationMap[sortName]]);

                    return sortLogic(aRawDuration, bRawDuration);
                } else if (sortName === 'Defect') {
                    const aSortName = a[sortName].key;
                    const bSortName = b[sortName].key;

                    return sortLogic(aSortName, bSortName);
                }

                const aSortName = a[sortName];
                const bSortName = b[sortName];

                return sortLogic(aSortName, bSortName);
            })
            .slice(startPaginationIndex, endPaginationIndex)
            .map(({
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
            }));

        const colConfig = {flex: {0: 0.5, 1: 0.5, 2: 0.5, 3: 0.5, 4: 0.5, 5: 2, 6: 1, 7: 0.5, 8: 0.8, 9: 0.7}};

        const viewingPropertyFrom = (this.state.pager.pageNumber - 1) * this.state.pager.itemsPerPage + 1;
        const viewingPropertyTo = Math.min(viewingPropertyFrom + this.state.pager.itemsPerPage - 1, this.state.pager.numItems);

        const pager = {
            ...this.state.pager,
            pageDescription: `Viewing ${viewingPropertyFrom} - ${viewingPropertyTo} of ${this.state.pager.numItems} defects`
        };

        return (
            <DataTable
                headers={headers}
                rows={rows}
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
