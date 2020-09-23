import React, {Component, Fragment, isValidElement} from 'react';
import PropTypes from 'prop-types';
import {CSVLink} from 'react-csv';
import {v1 as uuid} from 'uuid';
import sanitizeHtml from 'sanitize-html';
import Tooltip from '@homeaway/react-tooltip';
import {SVGIcon} from '@homeaway/react-svg';
import {
    INFO__16, DOWNLOAD__16, GEAR__24, CHEVRON_DOWN__12, CHEVRON_UP__12
} from '@homeaway/svg-defs';
import {Divider} from '@homeaway/react-collapse';
import {Checkbox} from '@homeaway/react-form-components';
import './DataTable.less';
import {Dropdown, DropdownItem} from '@homeaway/react-dropdown';
import NoResults from '../NoResults';

const sanitizeOption = {
    allowedAttributes: Object.assign(sanitizeHtml.defaults.allowedAttributes, {div: ['value']})
};

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [],
            rules: [],
            columnsInfo: {},
            columnHeaders: {},
            sortByColumn: null,
            sortByDirection: 'desc',
            sortDisabled: false,
            csvColumns: [],
            enableCSVDownload: false,
            paginated: false,
            pageSize: 25,
            currPageIndex: 0,
            showSettings: false,
            enableColumnDisplaySettings: false,
            displayColumns: [],
            expandableColumns: [],
            expandedRows: {},
            expandAllRows: false,
            isSorting: false
        };
    }

    static getDerivedStateFromProps(props, currState) {
        const dataIsNotEqual = (a, b) => {
            if (a.length !== b.length) {
                return true;
            }
            for (let idx = 0; idx < a.length; idx++) {
                const itemA = a[idx];
                const itemB = b[idx];
                const keys = Object.keys(itemA);
                for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
                    const propertyName = keys[keyIdx];
                    if (itemA[propertyName] !== itemB[propertyName]) {
                        return true;
                    }
                }
            }
            return false;
        };
        if (JSON.stringify(currState.columns) !== JSON.stringify(props.columns)
            || (!currState.isSorting && dataIsNotEqual(currState.data, props.data))) {
            const {data} = props;
            const mappedData = data.map((d) => {
                const mapped = d;
                mapped.rowId = uuid();
                return mapped;
            });
            const obj = {
                columnCheckboxes: props.columns.map((c) => ({
                    text: c,
                    checked: !props.hiddenColumns.includes(c)
                })),
                displayColumns: props.columns.filter((c) => !props.hiddenColumns.includes(c))
            };
            return {
                ...props, ...obj, expandedRows: {}, data: mappedData, isSorting: false
            };
        } if (currState.data.length > 0) {
            return {...currState};
        }
        return null;
    }

    getCSVData = () => this.state.data.map((row) => {
        const csvRows = [];
        const columns = this.state.csvColumns.length > 0
            ? this.state.csvColumns
            : this.state.displayColumns;
        columns.forEach((column) => {
            const value = row[column];
            csvRows.push(value ? String(value).replace(/<[^>]*>?/gm, '') : value);
        });
        return csvRows;
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
            this.setState({
                data, sortByColumn: column, sortByDirection: 'desc', isSorting: true
            });
        } else {
            data.sort((a, b) => -comparator(a, b)); // reverse
            this.setState({
                data, sortByColumn: column, sortByDirection: 'asc', isSorting: true
            });
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
                    dangerouslySetInnerHTML={{__html: sanitizeHtml(item[col], sanitizeOption)}} // eslint-disable-line
                />
            )
    );

    renderToggleCol = (rowId) => (
        <td key={uuid()}>
            <div role="button" tabIndex="0" onKeyDown={() => this.handleToggleExpand(rowId)} className="toggle-btn" onClick={() => this.handleToggleExpand(rowId)}>
                {this.state.expandedRows[rowId]
                    ? <SVGIcon inlineFlex markup={CHEVRON_UP__12} />
                    : <SVGIcon inlineFlex markup={CHEVRON_DOWN__12} />}
            </div>
        </td>
    )

    renderRow = (item) => {
        const isExpandableCol = this.state.expandableColumns.length > 0;
        const hasExpandableContent = this.state.expandableColumns.reduce((acc, col) => !!item[col] && acc, true);
        let toggleCol = null;
        if (isExpandableCol) {
            toggleCol = hasExpandableContent
                ? this.renderToggleCol(item.rowId)
                : <td />;
        }
        return (
            <Fragment key={uuid()}>
                <tr>
                    {toggleCol}
                    {this.state.displayColumns.map((col) => this.renderColumn(item, col))}
                </tr>
                <tr className={`expandable-row ${hasExpandableContent && this.state.expandedRows[item.rowId] ? '' : 'hidden'}`}>
                    <td className="expandable-column" colSpan={this.state.displayColumns.length + 1}>
                        {this.state.expandableColumns.map((col) => <Fragment key={uuid()}>{item[col]}</Fragment>)}
                    </td>
                </tr>
            </Fragment>
        );
    };

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

    renderInfoTooltip = (content) => (
        <div className="info-tooltip ">
            <Tooltip tooltipType="tooltip--lg" content={content} placement="bottom">
                <SVGIcon inlineFlex markup={INFO__16} />
            </Tooltip>
        </div>
    )

    renderTableHeaderColumn = (column) => {
        let headerColumnContent;
        if (this.state.columnHeaders[column]) {
            headerColumnContent = this.state.columnHeaders[column];
        } else if (this.state.columnsInfo[column]) {
            headerColumnContent = (
                <>{column} {this.renderInfoTooltip(this.state.columnsInfo[column])}</>
            );
        } else {
            headerColumnContent = column;
        }
        return (
            <th
                onClick={() => this.onClickSort(column)}
                key={column}
                className={this.state.sortDisabled ? null : 'pointer'}
            >
                {headerColumnContent}
            </th>
        );
    }

    toggleExpandAll = () => {
        this.setState((prevState) => {
            const expandAllRows = !prevState.expandAllRows;
            const expandedRows = {};
            this.state.data.forEach((row) => {
                expandedRows[row.rowId] = expandAllRows;
            });
            return {
                expandedRows,
                expandAllRows
            };
        });
    }

    renderToggleHeaderColumn = () => {
        if (this.state.expandableColumns.length < 1) {
            return null;
        }
        const toggleIcon = this.state.expandAllRows
            ? <SVGIcon inlineFlex markup={CHEVRON_UP__12} />
            : <SVGIcon inlineFlex markup={CHEVRON_DOWN__12} />;
        return <th className="pointer" onClick={this.toggleExpandAll}>{toggleIcon}</th>;
    }

    renderTableHeader = () => (
        <tr>
            {this.renderToggleHeaderColumn()}
            {this.state.displayColumns.map(this.renderTableHeaderColumn)}
        </tr>
    );

    getPrevPage = () => {
        this.setState((prevState) => ({
            currPageIndex: prevState.currPageIndex - 1
        }));
    }

    getNextPage = () => {
        this.setState((prevState) => ({
            currPageIndex: prevState.currPageIndex + 1
        }));
    }

    renderPrevButton = (show) => (
        <button type="button" className="btn btn-default" onClick={this.getPrevPage} disabled={!show}>{'Previous'}</button>
    )

    renderNextButton = (show) => (
        <button type="button" className="btn btn-default" onClick={this.getNextPage} disabled={!show}>{'Next'}</button>
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
        return <>{result}</>;
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
                {'Page Size:'}
                <Dropdown id="pagesize-dropdown" label={this.state.pageSize} className="pagesize-dropdown" closeAfterContentClick>
                    {[25, 50, 75, 100].map((n) => <DropdownItem key={`page-${n}`} link="#" text={n} onClick={() => this.setState({pageSize: n})} />)}
                </Dropdown>
            </div>
        );
    }

    handleColumnCheckbox = (column) => {
        this.setState((prevState) => {
            const {columnCheckboxes} = prevState;
            const idx = columnCheckboxes
                .findIndex((c) => c.text === column.text);
            columnCheckboxes[idx].checked = (
                !columnCheckboxes[idx].checked);
            return {
                columnCheckboxes,
                displayColumns: columnCheckboxes
                    .filter((cbox) => cbox.checked)
                    .map((cbox) => cbox.text)
            };
        });
    }

    renderColumnCheckbox = (c) => (
        <Checkbox
            key={`column-${c.text}`}
            size="sm"
            className="checkbox-column col-xs-3"
            name={c.text}
            label={c.text}
            checked={c.checked}
            onChange={() => this.handleColumnCheckbox(c)}
        />
    )

    handleShowSettings = () => {
        this.setState((prevState) => ({showSettings: !prevState.showSettings}));
    }

    handleToggleExpand(rowId) {
        this.setState((prevState) => ({
            expandedRows: {
                ...prevState.expandedRows,
                [rowId]: !prevState.expandedRows[rowId]
            }
        }));
    }

    getCSVHeader = () => {
        const {csvColumns, displayColumns, columns} = this.state;
        if (csvColumns && csvColumns.length) {
            return csvColumns;
        }
        if (displayColumns && displayColumns.length) {
            return displayColumns;
        }
        return columns;
    }

    renderDownloadLink = () => (
        <CSVLink
            className="btn btn-default data-table__download"
            headers={this.getCSVHeader()}
            data={this.getCSVData()}
            filename={`${this.state.csvFilename || 'opxhub-table.csv'}`}
        >
            <button type="button" className="btn btn-default settings-btn">
                <SVGIcon markup={DOWNLOAD__16} /> <div className="btn-label">{'Download CSV'}</div>
            </button>
        </CSVLink>
    )

    renderColumnDisplaySettings = () => (
        <button type="button" className={`btn btn-default settings-btn ${this.state.showSettings ? 'active' : ''}`} onClick={this.handleShowSettings}>
            <SVGIcon markup={GEAR__24} /> <div className="btn-label">{'Manage Columns'}</div>
        </button>
    )

    // eslint-disable-next-line complexity
    renderToolbar = (title, info) => (
        <>
            <h3 className="data-table__title">{title}{info && this.renderInfoTooltip(info)}</h3>
            {this.state.enableColumnDisplaySettings && this.renderColumnDisplaySettings()}
            {this.state.enableCSVDownload && this.renderDownloadLink()}
            <Divider heading="Settings" id="settings-divider" className="settings-divider" expanded={this.state.showSettings}>
                <form>
                    {this.state.columnCheckboxes && this.state.columnCheckboxes.length > 1
                        && this.state.columnCheckboxes.slice(1).map(this.renderColumnCheckbox)}
                </form>
            </Divider>
        </>
    )

    renderTable = () => (
        <>
            {this.renderToolbar(this.state.title, this.state.info)}
            <table className="data-table">
                <thead className="data-table-header">{this.renderTableHeader()}</thead>
                <tbody className="data-table-body">{this.renderTableBody()}</tbody>
            </table>
            {this.renderPagination()}
            {this.props.renderFooter(this.state.data)}
        </>
    )

    render() {
        return (
            <div className={`data-table__container ${this.props.className}`}>
                {this.state.data.length ? this.renderTable() : <NoResults />}
            </div>
        );
    }
}

DataTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    hiddenColumns: PropTypes.arrayOf(PropTypes.string),
    renderFooter: PropTypes.func
};

DataTable.defaultProps = {
    hiddenColumns: [],
    renderFooter: () => {}
};

export default DataTable;
