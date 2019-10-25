import React, {Fragment, Component, isValidElement} from 'react';
import uuid from 'uuid/v1';
import sanitizeHtml from 'sanitize-html';
import Tooltip from '@homeaway/react-tooltip';
import {SVGIcon} from '@homeaway/react-svg';
import {INFO__16} from '@homeaway/svg-defs';
import './DataTable.less';
import { Dropdown, DropdownItem } from '@homeaway/react-dropdown';
import PropTypes from 'prop-types';

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [],
            rules: [],
            columnsInfo: {},
            sortByColumn: null,
            sortByDirection: 'desc',
            sortDisabled: false,
            filename: 'hubble-table.csv',
            csvColumns: [],
            paginated: true,
            pageSize: 25,
            currPageIndex: 0
        };
    }

    static getDerivedStateFromProps(props, currState) {
        if (currState.data.length !== props.data.length) {
            return {...props};
        } if (currState.data.length > 0) {
            return {...currState};
        }
        return null;
    }
    
    getCSVData = () => this.state.data.map(row => {
        const csvRow = [];
        const columns = this.state.csvColumns.length > 0
            ? this.state.csvColumns
            : this.state.columns;
        columns.forEach((column) => {
            const value = row[column];
            csvRow.push(value ? String(value).replace(/<[^>]*>?/gm, '') : value);
        });
        return csvRow;
    })

    onClickSort = (column) => {
        if (this.state.sortDisabled) {
            return;
        }
        const comparator = (a, b) => {
            const valA = a[column];
            const valB = b[column];
            const strA = String(valA).toLowerCase().replace('%', '');
            const strB = String(valB).toLowerCase().replace('%', '');
            const numA = Number(strA);
            const numB = Number(strB);
            if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
                return numA - numB;
            }
            if (React.isValidElement(valA) && React.isValidElement(valB)) {
                return String(valA.key).localeCompare(String(valB.key));
            }
            return strA.localeCompare(strB);
        };
        const {data, sortByColumn, sortByDirection} = this.state;
        if (column === sortByColumn && sortByDirection === 'asc') {
            data.sort(comparator);
            this.setState({data, sortByColumn: column, sortByDirection: 'desc'});
        } else {
            data.sort((a, b) => -comparator(a, b)); // reverse
            this.setState({data, sortByColumn: column, sortByDirection: 'asc'});
        }
    }

    applyRule = (item, col) => {
        const found = this.state.rules.find((rule) => rule.column === col);
        return found ? found.setClass(item[col]) : '';
    }

    renderColumn = (item, col) => (
        isValidElement(item[col])
            ? <td key={uuid()} className={this.applyRule(item, col)}>{item[col]}</td>
            : (
                <td
                    key={uuid()}
                    className={this.applyRule(item, col)}
                    dangerouslySetInnerHTML={{__html: sanitizeHtml(item[col])}} // eslint-disable-line
                />
            )
    )

    renderRow = (item) => (
        <tr key={uuid()}>
            {this.state.columns.map((col) => this.renderColumn(item, col))}
        </tr>
    );

    renderTableBody = () => {
        const {
            data, paginated, currPageIndex, pageSize
        } = this.state;
        if (!paginated) {
            return data.map(this.renderRow);
        }
        const start = currPageIndex * pageSize;
        return data.slice(start, start + pageSize).map(this.renderRow);
    }

    renderColumnInfo = (content) => (
        <div className="column-info">
            <Tooltip tooltipType="tooltip--lg" content={content}>
                <SVGIcon inlineFlex markup={INFO__16} />
            </Tooltip>
        </div>
    )

    renderTableHeaderColumn = (column) => (
        <th
            onClick={() => this.onClickSort(column)}
            key={column}
            className={this.state.sortDisabled ? null : 'pointer'}
        >
            {column}
            {
                this.state.columnsInfo[column]
                    ? this.renderColumnInfo(this.state.columnsInfo[column])
                    : null
            }
        </th>
    )

    renderTableHeader = () => (
        <tr>{this.state.columns.map(this.renderTableHeaderColumn)}</tr>
    );

    getPrevPage = () => {
        this.setState(prevState => ({
            currPageIndex: prevState.currPageIndex - 1
        }));
    }


    getNextPage = () => {
        this.setState(prevState => ({
            currPageIndex: prevState.currPageIndex + 1
        }));
    }

    renderPrevButton = (show) => (
        <button type="button" className="btn btn-default" onClick={this.getPrevPage} disabled={!show}>Previous</button>
    )

    renderNextButton = (show) => (
        <button type="button" className="btn btn-default" onClick={this.getNextPage} disabled={!show}>Next</button>
    )

    getPage = (i) => {
        this.setState({currPageIndex: i});
    }

    renderPageButtons = () => {
        const {
            data, pageSize, paginated, currPageIndex
        } = this.state;
        if (!paginated) {
            return <div />;
        }
        const MAX_PAGES = Math.ceil(data.length / pageSize);
        const nextPages = Math.min(MAX_PAGES - currPageIndex, 3);
        const prevPages = Math.min(currPageIndex, 2);
        const result = [
            <button key={uuid()} type="button" className="btn btn-default" disabled>{currPageIndex + 1}</button>
        ];
        for (let i = 0; i < prevPages; i++) {
            result.unshift(
                <button key={uuid()} type="button" className="btn btn-default" onClick={() => this.getPage(currPageIndex - (i + 1))}>{currPageIndex - i}</button>
            );
        }
        for (let i = 1; i < nextPages; i++) {
            result.push(
                <button key={uuid()} type="button" className="btn btn-default" onClick={() => this.getPage(currPageIndex + i)}>{currPageIndex + i + 1}</button>
            );
        }
        return <Fragment>{result}</Fragment>;
    }

    renderPagination = () => {
        const {
            data, pageSize, paginated, currPageIndex
        } = this.state;
        if (!paginated) {
            return <div />;
        }
        const MAX_PAGES = Math.ceil(data.length / pageSize);
        const showNext = currPageIndex < MAX_PAGES - 1;
        const showPrev = currPageIndex > 0 && MAX_PAGES > 1;
        return (
            <div className="pagination text-center">
                <div className="btn-group">
                    {this.renderPrevButton(showPrev)}
                    {this.renderPageButtons(showNext || showPrev)}
                    {this.renderNextButton(showNext)}
                </div>
                Page Size:
                <Dropdown id="pagesize-dropdown" label={this.state.pageSize} className="pagesize-dropdown">
                    <DropdownItem link="#" text="25" onClick={() => this.setState({pageSize: 25})} />
                    <DropdownItem link="#" text="50" onClick={() => this.setState({pageSize: 50})} />
                    <DropdownItem link="#" text="75" onClick={() => this.setState({pageSize: 75})} />
                    <DropdownItem link="#" text="100" onClick={() => this.setState({pageSize: 100})} />
                </Dropdown>
            </div>
        );
    }

    render() {
        return (
            this.state.data.length
                ? (
                    <div>
                        <table className="data-table">
                            <thead className="data-table-header">{this.renderTableHeader()}</thead>
                            <tbody className="data-table-body">{this.renderTableBody()}</tbody>
                        </table>
                        {this.renderPagination()}
                    </div>
                )
                : <p className="data-table__msg">No Results Found</p>
        );
    }
}
DataTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()).isRequired

};
export default DataTable;
