import React, {Fragment, isValidElement, useState, useEffect} from 'react';
import {FormInput} from '@homeaway/react-form-components';
import {CSVLink} from 'react-csv';
import {v1 as uuid} from 'uuid';
import sanitizeHtml from 'sanitize-html';
import Tooltip from '@homeaway/react-tooltip';
import {SVGIcon} from '@homeaway/react-svg';
import {
    INFO__16, DOWNLOAD__16, GEAR__24, CHEVRON_DOWN__12, CHEVRON_UP__12, SEARCH__16
} from '@homeaway/svg-defs';
import {Divider} from '@homeaway/react-collapse';
import {Checkbox} from '@homeaway/react-form-components';
import './DataTable.less';
import {Dropdown, DropdownItem} from '@homeaway/react-dropdown';
import NoResults from '../NoResults';
import {getCellStringValue, stringNumComparator} from './utils';

const sanitizeOption = {
    allowedAttributes: Object.assign(sanitizeHtml.defaults.allowedAttributes, {div: ['value']})
};

const DataTable = ({
    data = [],
    renderFooter = () => {},
    columns = [],
    hiddenColumns = [],
    rules = [],
    columnsInfo = {},
    columnHeaders = {},
    sortByColumn = null,
    sortByDirection = 'desc',
    sortDisabled = false,
    csvColumns = [],
    enableCSVDownload = false,
    enableTextSearch = false,
    paginated = false,
    enableColumnDisplaySettings = false,
    expandableColumns = [],
    expandedRows = {},
    expandAllRows = false,
    className = '',
    title = '',
    info = '',
    csvFilename = 'opxhub-table.csv'

}) => {
    const mapData = (arr) => arr.map((d) => {
        const mapped = d;
        mapped.rowId = uuid();
        return mapped;
    });

    const initiateColumns = (cols) => cols.map((c) => ({
        text: c,
        checked: !hiddenColumns.includes(c)
    }));

    const [filteredData, setFilteredData] = useState([]);
    const [currPageIndex, setCurrPageIndex] = useState(0);
    const [displayColumns, setDisplayColumns] = useState(columns.filter((c) => !hiddenColumns.includes(c)));
    const [columnCheckboxes, setColumnCheckboxes] = useState(initiateColumns(columns));
    const [searchText, setSearchText] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [pageSize, setPageSize] = useState(25);
    const [sortedByColumn, setSortedByColumn] = useState(sortByColumn || '');
    const [sortedByDirection, setSortedByDirection] = useState(sortByDirection === 'asc' ? 'asc' : 'desc');
    const [controlledExpandAllRows, setControlledExpandAllRows] = useState(expandAllRows);
    const [controlledExpandedRows, setControlledExpandedRows] = useState(expandedRows);
    const [refreshColumns, setRefreshColumns] = useState('');
    const [reSortData, setReSortData] = useState('');


    useEffect(() => {
        const newDisplayColumns = columnCheckboxes.filter((c) => c.checked).map((x) => x?.text);
        setDisplayColumns(newDisplayColumns);
    }, [columnCheckboxes, refreshColumns]);

    useEffect(() => {
        const hasValue = (x) => !!x || x === 0;

        const reactElementComparator = (a, b) => {
            if (hasValue(a.key) || hasValue(b.key)) {
                return stringNumComparator(a.key, b.key);
            }
            if (hasValue(a.props.value) || hasValue(b.props.value)) {
                return stringNumComparator(a.props.value, b.props.value);
            }
            return stringNumComparator(a.props.children, b.props.children);
        };

        const comparator = (a, b, column) => {
            const valA = a[column];
            const valB = b[column];
            // Compare react elements
            return (React.isValidElement(valA) && React.isValidElement(valB))
                ? reactElementComparator(valA, valB)
                : stringNumComparator(valA, valB);
        };

        let newSortedData = filteredData;
        if (sortedByColumn) {
            if (sortedByDirection === 'asc') {
                newSortedData.sort((a, b) => comparator(a, b, sortedByColumn));
            } else {
                newSortedData.sort((a, b) => -comparator(a, b, sortedByColumn));
            }
        }
        setFilteredData(newSortedData);
        setReSortData(uuid());
    }, [sortedByColumn, sortedByDirection, filteredData]);

    useEffect(() => {
        setCurrPageIndex(0);
        setFilteredData(mapData(data));
    }, [data]);

    useEffect(() => {
        setCurrPageIndex(0);
        const findSearchText = (t) => String(t).includes(searchText);
        const dataToDisplay = enableTextSearch && searchText
            ? data.filter((d) => Object.values(d).findIndex(findSearchText) > -1)
            : data;
        setFilteredData(dataToDisplay);
    }, [searchText, data, enableTextSearch]);

    const handleColumnCheckbox = (column) => {
        const newColumnCheckboxes = columnCheckboxes;
        const idx = columnCheckboxes.findIndex((c) => c.text === column.text);
        newColumnCheckboxes[idx].checked = (!columnCheckboxes[idx].checked);
        setColumnCheckboxes(newColumnCheckboxes);
        setRefreshColumns(uuid());
    };

    const renderColumnCheckbox = (c) => (
        <Checkbox
            key={`column-${c.text}`}
            size="sm"
            className="checkbox-column"
            name={c.text}
            label={c.text}
            checked={c.checked}
            onChange={() => handleColumnCheckbox(c)}
        />
    );

    const handleShowSettings = () => setShowSettings(!showSettings);

    const handleToggleExpand = (rowId) => {
        const key = rowId;
        let newExpandedRows = controlledExpandedRows;
        newExpandedRows = {[key]: !controlledExpandedRows[key]};
        setControlledExpandedRows(newExpandedRows);
    };

    const onClickSort = (column) => {
        if (!sortDisabled) {
            setSortedByColumn(column);
            setSortedByDirection(sortedByDirection === 'asc' ? 'desc' : 'asc');
            // setReSortData(uuid());
        }
    };

    const renderColumnDisplaySettings = () => (
        <button type="button" className={`btn btn-default settings-btn ${showSettings ? 'active' : ''}`} onClick={handleShowSettings}>
            <SVGIcon markup={GEAR__24} /> <div className="btn-label">{'Manage Columns'}</div>
        </button>
    );

    const renderSearchInput = () => (
        <FormInput
            id="search-input"
            name="searchInput"
            label=""
            className="table-search-input"
            leftContent={<SVGIcon useFill inlineFlex markup={SEARCH__16}/>}
            onChange={(event) => setSearchText(event.target.value)}
            value={searchText}
        />
    );

    const getCSVData = () => filteredData.map((row) => {
        const cols = csvColumns.length ? csvColumns : displayColumns;
        return cols.reduce((acc, column) => {
            acc.push(getCellStringValue(row[column]));
            return acc;
        }, []);
    });

    const getCSVHeader = () => {
        if (csvColumns && csvColumns.length) {
            return csvColumns;
        }
        if (displayColumns && displayColumns.length) {
            return displayColumns;
        }
        return columns;
    };

    const renderDownloadLink = () => (
        <CSVLink
            className="btn btn-default data-table__download"
            headers={getCSVHeader()}
            data={getCSVData()}
            filename={csvFilename}
        >
            <button type="button" className="btn btn-default settings-btn">
                <SVGIcon markup={DOWNLOAD__16} /> <div className="btn-label">{'Download CSV'}</div>
            </button>
        </CSVLink>
    );

    const getPrevPage = () => setCurrPageIndex(currPageIndex - 1);

    const getNextPage = () => setCurrPageIndex(currPageIndex + 1);

    const renderPrevButton = (show) => <button type="button" className="btn btn-default" onClick={getPrevPage} disabled={!show}>{'Previous'}</button>;

    const renderNextButton = (show) => <button type="button" className="btn btn-default" onClick={getNextPage} disabled={!show}>{'Next'}</button>;

    const getPage = (i) => setCurrPageIndex(i);

    const renderPageButtons = () => {
        if (!paginated) {
            return <div />;
        }
        const MAX_PAGES = Math.ceil(filteredData.length / pageSize);
        const nextPages = Math.min(MAX_PAGES - currPageIndex, 3);
        const prevPages = Math.min(currPageIndex, 2);
        const result = [
            <button key={uuid()} type="button" className="btn btn-default" disabled>{currPageIndex + 1}</button>
        ];
        for (let i = 0; i < prevPages; i++) {
            result.unshift(
                <button key={uuid()} type="button" className="btn btn-default" onClick={() => getPage(currPageIndex - (i + 1))}>{currPageIndex - i}</button>
            );
        }
        for (let i = 1; i < nextPages; i++) {
            result.push(
                <button key={uuid()} type="button" className="btn btn-default" onClick={() => getPage(currPageIndex + i)}>{currPageIndex + i + 1}</button>
            );
        }
        return <>{result}</>;
    };

    const renderPagination = () => {
        if (!paginated) {
            return <div />;
        }
        const MAX_PAGES = Math.ceil(filteredData.length / pageSize);
        const showNext = currPageIndex < MAX_PAGES - 1;
        const showPrev = currPageIndex > 0 && MAX_PAGES > 1;

        const onPageSizeClick = (n) => {
            const maxPages = Math.ceil(filteredData.length / n);
            const shouldSetCurrPageIndex = maxPages < currPageIndex;
            setPageSize(n);
            setCurrPageIndex(shouldSetCurrPageIndex ? (maxPages - 1) : currPageIndex);
        };

        return (
            <div className="pagination text-center">
                <div className="btn-group">
                    {renderPrevButton(showPrev)}
                    {renderPageButtons(showNext || showPrev)}
                    {renderNextButton(showNext)}
                </div>
                {'Page Size:'}
                <Dropdown id="pagesize-dropdown" label={pageSize} className="pagesize-dropdown" closeAfterContentClick>
                    {[25, 50, 75, 100].map((n) => <DropdownItem key={`page-${n}`} link="#" text={n} onClick={() => onPageSizeClick(n)} />)}
                </Dropdown>
            </div>
        );
    };

    const renderInfoTooltip = (content) => (
        <div className="info-tooltip ">
            <Tooltip tooltipType="tooltip--lg" content={content} placement="bottom" fullWidth>
                <SVGIcon inlineFlex markup={INFO__16} />
            </Tooltip>
        </div>
    );

    const renderControllers = () => (<>
        {enableColumnDisplaySettings && renderColumnDisplaySettings()}
        {enableCSVDownload && renderDownloadLink()}
        {enableTextSearch && renderSearchInput()}
    </>);

    // eslint-disable-next-line complexity
    const renderToolbar = (tableTitle, tableInfo, id) => (
        <Fragment key={id}>
            <h3 className="data-table__title">{tableTitle}{tableInfo && renderInfoTooltip(tableInfo)}</h3>
            {!!data.length && renderControllers()}
            <Divider heading="Settings" id="settings-divider" className="settings-divider" expanded={showSettings}>
                <form>
                    {columnCheckboxes && columnCheckboxes.length > 1
                        && columnCheckboxes.slice(1).map(renderColumnCheckbox)}
                </form>
            </Divider>
        </Fragment>
    );

    const getHeaderColumnContent = (column) => {
        if (columnHeaders[column]) {
            return columnHeaders[column];
        }
        if (columnsInfo[column]) {
            return <>{column} {renderInfoTooltip(columnsInfo[column])}</>;
        }
        return column;
    };

    const renderTableHeaderColumn = (column) => {
        const sortingIcon = sortedByDirection === 'asc'
            ? <SVGIcon inlineFlex markup={CHEVRON_UP__12} />
            : <SVGIcon inlineFlex markup={CHEVRON_DOWN__12} />;
        return (
            <th
                onClick={() => onClickSort(column)}
                key={column}
                className={sortDisabled ? null : 'pointer'}
            >
                {getHeaderColumnContent(column)}
                {column === sortedByColumn && sortingIcon}
            </th>
        );
    };

    const toggleExpandAll = () => {
        const newExpandedRows = {};
        setControlledExpandAllRows(!controlledExpandAllRows);
        filteredData.forEach((row) => {
            newExpandedRows[row.rowId] = controlledExpandAllRows;
        });
        setControlledExpandedRows(newExpandedRows);
    };

    const renderToggleHeaderColumn = () => {
        if (expandableColumns.length < 1) {
            return null;
        }
        const toggleIcon = expandAllRows
            ? <SVGIcon inlineFlex markup={CHEVRON_UP__12} />
            : <SVGIcon inlineFlex markup={CHEVRON_DOWN__12} />;
        return <th className="pointer" onClick={toggleExpandAll}>{toggleIcon}</th>;
    };

    const renderTableHeader = (id) => (
        <tr key={`header-${id}`}>
            {renderToggleHeaderColumn()}
            {displayColumns?.length ? displayColumns.map(renderTableHeaderColumn) : columns.map(renderTableHeaderColumn)}
        </tr>
    );

    const applyRule = (item, col) => {
        const found = rules.find((rule) => rule.column === col);
        return found ? found.setClass(item[col]) : '';
    };

    const renderColumn = (item, col) => (
        isValidElement(item[col])
            ? <td key={uuid()} className={applyRule(item, col)}>{item[col]}</td>
            : (
                <td
                    key={uuid()}
                    className={applyRule(item, col)}
                    dangerouslySetInnerHTML={{__html: sanitizeHtml(item[col], sanitizeOption)}} // eslint-disable-line
                />
            )
    );

    const renderToggleCol = (rowId) => (
        <td key={uuid()}>
            <div role="button" tabIndex="0" onKeyDown={() => handleToggleExpand(rowId)} className="toggle-btn" onClick={() => handleToggleExpand(rowId)}>
                {controlledExpandedRows[rowId]
                    ? <SVGIcon inlineFlex markup={CHEVRON_UP__12} />
                    : <SVGIcon inlineFlex markup={CHEVRON_DOWN__12} />}
            </div>
        </td>
    );

    const renderRow = (item) => {
        const isExpandableCol = expandableColumns.length > 0;
        const hasExpandableContent = expandableColumns.reduce((acc, col) => !!item[col] && acc, true);
        let toggleCol = null;
        if (isExpandableCol) {
            toggleCol = hasExpandableContent
                ? renderToggleCol(item.rowId)
                : <td />;
        }
        return (
            <Fragment key={uuid()}>
                <tr>
                    {toggleCol}
                    {displayColumns.map((col) => renderColumn(item, col))}
                </tr>
                <tr className={`expandable-row ${hasExpandableContent && controlledExpandedRows[item.rowId] ? '' : 'hidden'}`}>
                    <td className="expandable-column" colSpan={displayColumns.length + 1}>
                        {expandableColumns.map((col) => <Fragment key={uuid()}>{item[col]}</Fragment>)}
                    </td>
                </tr>
            </Fragment>
        );
    };

    const renderTableBody = () => {
        if (!paginated) {
            return filteredData.map(renderRow);
        }
        const start = currPageIndex * pageSize;
        return filteredData?.slice(start, start + pageSize).map(renderRow);
    };

    const renderTable = () => (
        <Fragment key={`table+${reSortData}`}>
            <table className="data-table">
                <thead className="data-table-header">{renderTableHeader(columnCheckboxes)}</thead>
                <tbody className="data-table-body">{renderTableBody()}</tbody>
            </table>
            {renderPagination()}
            {renderFooter(filteredData)}
        </Fragment>
    );

    return (
        <div className={`data-table__container ${className}`}>
            {renderToolbar(title, info, refreshColumns)}
            {data.length ? renderTable() : <NoResults />}
        </div>
    );
};


export default DataTable;