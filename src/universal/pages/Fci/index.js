import React, {useEffect, useState, useCallback} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import {Checkbox, RadioGroup, RadioButton} from '@homeaway/react-form-components';
import FilterDropDown from '../../components/FilterDropDown';
import LineChartWrapper from '../../components/LineChartWrapper';
import DataTable from '../../components/DataTable';
import LoadingContainer from '../../components/LoadingContainer';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import {checkResponse} from '../utils';
import {EXPEDIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND, LOB_LIST} from '../../constants';
import {getQueryValues, getQueryString, getPresets, getLineChartData, getTableData, getErrorCodes, getBrandSites} from './utils';
import TraceLogModal from './TraceLogModal';
import {FCI_TABLE_COLUMNS, FCI_HIDDEN_TABLE_COLUMNS, ALL_CATEGORIES, CATEGORY_OPTION, CODE_OPTION} from './constants';
import './styles.less';

const Fci = ({selectedBrands}) => {
    const SHOW_FILTERS = false;
    const history = useHistory();
    const {search, pathname} = useLocation();
    const {
        initialStart,
        initialEnd,
        initialTimeRange,
        initialLobs,
        initialErrorCode,
        initialSite,
        initialCategories,
        initialHideIntentionalCheck
    } = getQueryValues(search);
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);
    const [selectedLobs, setSelectedLobs] = useState(initialLobs);
    const [selectedErrorCode, setSelectedErrorCode] = useState(initialErrorCode);
    const [selectedSite, setSelectedSite] = useState(initialSite);
    const [selectedCategory, setSelectedCategory] = useState(initialCategories);
    const [hideIntentionalCheck, setHideIntentionalCheck] = useState(initialHideIntentionalCheck);
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [pendingTimeRange, setPendingTimeRange] = useState(initialTimeRange);
    const [pendingLobs, setPendingLobs] = useState(initialLobs);
    const [pendingErrorCode, setPendingErrorCode] = useState(initialErrorCode);
    const [pendingSite, setPendingSite] = useState(initialSite);
    const [pendingCategory, setPendingCategory] = useState(initialCategories);
    const [pendingHideIntentionalCheck, setPendingHideIntentionalCheck] = useState(initialHideIntentionalCheck);
    const [prev, setPrev] = useState({start: null, end: null, data: []});
    const [errorCodes, setErrorCodes] = useState([]);

    const [isSupportedBrand, setIsSupportedBrand] = useState(false);

    const [chartProperty, setChartProperty] = useState(CATEGORY_OPTION);
    const [categories, setCategories] = useState([]);
    const [lineChartData, setLineChartData] = useState([]);
    const [lineChartKeys, setLineChartKeys] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({title: '', data: []});

    const handleOpenTraceLog = (traceId, recordedSessionUrl, data) => {
        setModalData({traceId, recordedSessionUrl, data});
        setIsModalOpen(true);
    };

    const processData = useCallback((data) => {
        const categorySet = new Set();
        const filteredData = data
            // eslint-disable-next-line complexity
            .filter(({fci, category}) => {
                (category || []).forEach((c) => categorySet.add(c));
                const hideIntentionalCheckMatch = !hideIntentionalCheck || (fci && !fci.isIntentional);
                const isWithinRange = fci && fci.timestamp && moment(fci.timestamp).isBetween(start, end, '[]', 'minute');
                const matchesCategory = selectedCategory === ALL_CATEGORIES || (category || []).includes(selectedCategory);
                return isWithinRange && matchesCategory && hideIntentionalCheckMatch;
            })
            .map(({fci, category, recordedSessionUrl}) => {
                const result = fci;
                result.category = (category || []).join(',');
                result.recordedSessionUrl = recordedSessionUrl;
                return result;
            });
        const chart = getLineChartData(start, end, filteredData, selectedErrorCode, chartProperty);
        setCategories([ALL_CATEGORIES, ...Array.from(categorySet).sort()]);
        setLineChartData(chart.data);
        setLineChartKeys(chart.keys);
        const {keys} = chartProperty !== CODE_OPTION
            ? getLineChartData(start, end, filteredData, selectedErrorCode, CODE_OPTION)
            : chart;
        setTableData(getTableData(filteredData, keys, handleOpenTraceLog));
        setErrorCodes(getErrorCodes(filteredData));
    }, [start, end, selectedCategory, selectedErrorCode, chartProperty, hideIntentionalCheck]);

    // eslint-disable-next-line complexity
    useEffect(() => {
        if (![EXPEDIA_PARTNER_SERVICES_BRAND, EXPEDIA_BRAND].includes(selectedBrands[0])) {
            setIsSupportedBrand(false);
            setError(`FCIs for ${selectedBrands[0]} is not yet available. For now only ${EXPEDIA_PARTNER_SERVICES_BRAND} and ${EXPEDIA_BRAND} is supported.
                If you have any questions, please ping #dpi-reo-opex-all or leave a comment via our Feedback form.`);
            return;
        }
        setIsLoading(true);
        setIsSupportedBrand(true);
        setError(null);
        const query = getQueryString(start, end, selectedLobs, selectedErrorCode, selectedSite, selectedCategory, hideIntentionalCheck);
        if (!prev.start || !prev.end || !prev.selectedSite || start.isBefore(prev.start) || end.isAfter(prev.end) || prev.selectedSite !== selectedSite) {
            fetch(`/getCheckoutFailures?${query}`)
                .then(checkResponse)
                .then((data) => {
                    setPrev({start, end, data, selectedSite});
                    processData(data);
                    history.push(`${pathname}?selectedBrand=${selectedBrands[0]}&${query}`);
                })
                .catch((err) => {
                    setError('Failed to retrieve FCI data. Try refreshing the page. '
                        + 'If the problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.');
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsLoading(false));
        } else {
            processData(prev.data);
            setIsLoading(false);
            history.push(`${pathname}?selectedBrand=${selectedBrands[0]}&${query}`);
        }
    }, [start, end, selectedLobs, selectedErrorCode, selectedSite, history, pathname, selectedBrands, hideIntentionalCheck, prev, processData, selectedCategory]);

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleApplyFilters = () => {
        setStart(pendingStart);
        setEnd(pendingEnd);
        setSelectedLobs(pendingLobs);
        setSelectedErrorCode(pendingErrorCode);
        setSelectedSite(pendingSite);
        setSelectedCategory(pendingCategory);
        setHideIntentionalCheck(pendingHideIntentionalCheck);
        setIsDirtyForm(false);
    };

    const handleDatetimeChange = ({start: startDateTimeStr, end: endDateTimeStr}, text) => {
        setPendingTimeRange(text || pendingTimeRange);
        setPendingStart(moment(startDateTimeStr));
        setPendingEnd(moment(endDateTimeStr));
        setIsDirtyForm(true);
    };

    const handleLoBsChange = (lobs) => {
        setPendingLobs(lobs || []);
        setIsDirtyForm(true);
    };

    const handleErrorCodeChange = (e) => {
        setPendingErrorCode(e);
        setIsDirtyForm(true);
    };

    const handleSiteChange = (e) => {
        setPendingSite(e && e.value);
        setIsDirtyForm(true);
    };

    const handleCategoryChange = (e) => {
        setPendingCategory(e);
        setIsDirtyForm(true);
    };

    const handleHideIntentionalCheck = (e) => {
        setPendingHideIntentionalCheck(e && e.target && e.target.checked);
        setIsDirtyForm(true);
    };

    const handleDotClick = (selected) => {
        if (selected && selected.dataKey) {
            const value = selected.dataKey;
            if (chartProperty === CODE_OPTION) {
                setPendingErrorCode(value);
                setSelectedErrorCode(value);
            } else if (chartProperty === CATEGORY_OPTION) {
                setPendingCategory(value);
                setSelectedCategory(value);
            }
        }
    };

    const handleMouseDown = (e) => {
        if (e && e.activeLabel) {
            setRefAreaLeft(e.activeLabel);
        }
    };

    const handleMouseMove = (e) => {
        if (refAreaLeft && e && e.activeLabel) {
            setRefAreaRight(e.activeLabel);
        }
    };

    const handleMouseUp = () => {
        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            setRefAreaLeft('');
            setRefAreaRight('');
            return;
        }
        // xAxis domain
        let nextRefAreaLeft = refAreaLeft;
        let nextRefAreaRight = refAreaRight;
        if (moment(refAreaLeft).isAfter(refAreaRight)) {
            // if refArea was dragged right to left
            [nextRefAreaLeft, nextRefAreaRight] = [refAreaRight, refAreaLeft];
        }
        setRefAreaLeft('');
        setRefAreaRight('');
        setPendingStart(moment(nextRefAreaLeft));
        setPendingEnd(moment(nextRefAreaRight));
        setPendingTimeRange(pendingTimeRange);
        setStart(moment(nextRefAreaLeft));
        setEnd(moment(nextRefAreaRight));
        setIsDirtyForm(false);
    };

    const handleChoiceChange = (event) => {
        if (event && event.target && event.target.value) {
            setChartProperty(event.target.value);
        }
    };

    return (
        <div className="fci-container">
            <h1>{'Failed Customer Interactions (FCI)'}</h1>
            {isSupportedBrand && <div className="form-container">
                <DatetimeRangePicker
                    onChange={handleDatetimeChange}
                    startDate={pendingStart.toDate()}
                    endDate={pendingEnd.toDate()}
                    presets={getPresets()}
                />
                <FilterDropDown
                    id="error-code-dropdown"
                    className="error-code-dropdown"
                    list={errorCodes}
                    selectedValue={pendingErrorCode}
                    onClickHandler={handleErrorCodeChange}
                />
                <Select
                    classNamePrefix="site-dropdown"
                    className="site-dropdown"
                    options={getBrandSites(selectedBrands[0]).map((x) => ({label: x, value: x}))}
                    onChange={handleSiteChange}
                    placeholder={pendingSite}
                    isSearchable
                />
                <FilterDropDown
                    id="category-dropdown"
                    className="category-dropdown"
                    list={categories}
                    selectedValue={pendingCategory}
                    onClickHandler={handleCategoryChange}
                />
                <Checkbox
                    name="intentional-сheckbox"
                    label="Hide Intentional Errors"
                    checked={pendingHideIntentionalCheck}
                    onChange={handleHideIntentionalCheck}
                    size="sm"
                    className="intentional-сheckbox"
                />
                {SHOW_FILTERS && (
                    <>
                        <Select
                            isMulti
                            classNamePrefix="lob-select"
                            className="lob-select-container"
                            value={pendingLobs}
                            options={LOB_LIST.filter(({value}) => ['H', 'C', 'F', 'P'].includes(value))}
                            onChange={handleLoBsChange}
                            placeholder={'Select Line of Business'}
                        />
                    </>
                )}
                <button
                    className="btn btn-primary apply-btn"
                    type="button"
                    onClick={handleApplyFilters}
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
            </div>}
            <LoadingContainer isLoading={isLoading} error={error} className="fci-loading-container">
                {isSupportedBrand && (
                    <>
                        <RadioGroup name="chart-choice" ariaLabel="Chart filter">
                            <RadioButton
                                className="chart-option"
                                label="Error Code"
                                value={CODE_OPTION}
                                checked={chartProperty === CODE_OPTION}
                                onChange={handleChoiceChange}
                            />
                            <RadioButton
                                className="chart-option"
                                label="Category"
                                value={CATEGORY_OPTION}
                                checked={chartProperty === CATEGORY_OPTION}
                                onChange={handleChoiceChange}
                            />
                        </RadioGroup>
                        <LineChartWrapper
                            title="Errors over Time"
                            helpText="Bucketed by 15 minute intervals"
                            data={lineChartData}
                            keys={lineChartKeys}
                            onDotClick={handleDotClick}
                            onMouseUp={handleMouseUp}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            refAreaLeft={refAreaLeft}
                            refAreaRight={refAreaRight}
                            enableLineHiding
                        />
                    </>
                )}
                <DataTable
                    title={`FCIs (${tableData.length} results)`}
                    data={tableData}
                    columns={FCI_TABLE_COLUMNS}
                    hiddenColumns={FCI_HIDDEN_TABLE_COLUMNS}
                    columnsInfo={{LoB: <div>{'Line of Business'}</div>}}
                    paginated
                    enableColumnDisplaySettings
                    enableTextSearch
                />
            </LoadingContainer>
            <TraceLogModal
                data={modalData}
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default Fci;
