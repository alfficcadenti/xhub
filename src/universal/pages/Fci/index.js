import React, {useEffect, useState, useCallback} from 'react';
import {useHistory, useLocation, withRouter} from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import {Checkbox, RadioGroup, RadioButton, FormInput} from '@homeaway/react-form-components';
import {Navigation} from '@homeaway/react-navigation';
import LineChartWrapper from '../../components/LineChartWrapper';
import LoadingContainer from '../../components/LoadingContainer';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import {checkResponse, getPresets} from '../utils';
import FciModal from './FciModal';
import {CATEGORY_OPTION, CODE_OPTION, FETCH_FAILED_MSG, CATEGORIES} from './constants';
import {
    shouldFetchData,
    getIsSupportedBrand,
    getUnsupportedBrandMsg,
    getQueryValues,
    getFciQueryString,
    getHistoryQueryString,
    getTableData,
    getBrandSites
} from './utils';
import './styles.less';


const Fci = ({selectedBrands}) => {
    const history = useHistory();
    const {search, pathname} = useLocation();
    const navLinks = [
        {id: 'trends', label: 'Trends', href: '/fci'},
        {id: 'search', label: 'Search', href: '/fci'}
    ];
    const {
        initialStart,
        initialEnd,
        initialTimeRange,
        initialErrorCode,
        initialSite,
        initialHideIntentionalCheck,
        initialId,
        initialIndex
    } = getQueryValues(search, selectedBrands[0]);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [activeIndex, setActiveIndex] = useState(initialIndex);

    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);
    const [selectedErrorCode, setSelectedErrorCode] = useState(initialErrorCode);
    const [selectedSite, setSelectedSite] = useState(initialSite);
    const [hideIntentionalCheck, setHideIntentionalCheck] = useState(initialHideIntentionalCheck);
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [pendingTimeRange, setPendingTimeRange] = useState(initialTimeRange);
    const [pendingErrorCode, setPendingErrorCode] = useState(initialErrorCode);
    const [pendingSite, setPendingSite] = useState(initialSite);
    const [pendingHideIntentionalCheck, setPendingHideIntentionalCheck] = useState(initialHideIntentionalCheck);
    const [selectedBucket, setSelectedBucket] = useState();
    const [prev, setPrev] = useState({
        start: null,
        end: null,
        data: [],
        chartProperty: null,
        selectedSite: initialSite,
        selectedErrorCode: initialErrorCode,
        hideIntentionalCheck: initialHideIntentionalCheck
    });
    const [errorCodes, setErrorCodes] = useState([]);
    const [searchText, setSearchText] = useState(initialId);

    const [isSupportedBrand, setIsSupportedBrand] = useState(getIsSupportedBrand(selectedBrands));

    const [chartProperty, setChartProperty] = useState(CATEGORY_OPTION);
    const [lineChartData, setLineChartData] = useState([]);
    const [lineChartKeys, setLineChartKeys] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalFci, setModalFci] = useState();
    const [modalEditMode, setModalEditMode] = useState(false);
    const [modalFcis, setModalFcis] = useState([]);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [modalError, setModalError] = useState();

    const processData = useCallback((data, property) => {
        const categorySet = property === CATEGORY_OPTION ? new Set(CATEGORIES) : new Set();
        const filteredData = JSON.parse(JSON.stringify(data))
            .filter(({timestamp}) => timestamp && moment(timestamp).isBetween(start, end, '[]', 'minute'))
            .map(({timestamp, counts}) => {
                Object.keys(counts).forEach((key) => categorySet.add(key));
                return {name: moment(timestamp).format('YYYY-MM-DD HH:mm'), timestamp, ...counts};
            });
        setLineChartData(filteredData);
        setLineChartKeys(Array.from(categorySet).sort());
        setErrorCodes(Array.from(categorySet).sort());
    }, [start, end]);

    const updateHistory = (tabIndex = activeIndex, id = searchText) => {
        const historyQuery = getHistoryQueryString(selectedBrands, start, end, selectedErrorCode,
            selectedSite, hideIntentionalCheck, chartProperty, id, tabIndex);
        history.push(`${pathname}?${historyQuery}`);
    };

    const handleOpenEdit = (fci) => {
        setModalFci(fci);
        setModalEditMode(true);
        setIsModalOpen(true);
        updateHistory(1, fci.Trace);
    };

    const searchFci = () => {
        if (!searchText) {
            return;
        }
        setIsModalLoading(true);
        setModalError();
        setIsModalOpen(true);
        updateHistory();
        fetch(`/getCheckoutFailure?searchId=${searchText}`)
            .then(checkResponse)
            .then((data) => {
                const fcis = getTableData(data, handleOpenEdit);
                setTableData(fcis);
                setModalFcis(fcis);
                setModalEditMode(false);
            })
            .catch((err) => {
                setModalError(FETCH_FAILED_MSG);
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsModalLoading(false));
    };

    // eslint-disable-next-line complexity
    useEffect(() => {
        if (!getIsSupportedBrand(selectedBrands)) {
            setIsSupportedBrand(false);
            setError(getUnsupportedBrandMsg(selectedBrands));
            return;
        }
        if (activeIndex === 1) {
            searchFci();
            return;
        }
        setIsLoading(true);
        setIsSupportedBrand(true);
        setError(null);
        updateHistory();
        if (shouldFetchData(prev, start, end, selectedSite, chartProperty, selectedErrorCode, hideIntentionalCheck)) {
            const fciQuery = getFciQueryString(start, end, selectedErrorCode, selectedSite, hideIntentionalCheck, chartProperty);
            const url = chartProperty === CATEGORY_OPTION
                ? `/getCheckoutFailureCategoryCounts?${fciQuery}`
                : `/getCheckoutFailureErrorCounts?${fciQuery}`;
            fetch(url)
                .then(checkResponse)
                .then((data) => {
                    setPrev({start, end, data, selectedSite, chartProperty, selectedErrorCode, hideIntentionalCheck});
                    processData(data, chartProperty);
                })
                .catch((err) => {
                    setError(FETCH_FAILED_MSG);
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsLoading(false));
        } else {
            processData(prev.data, chartProperty);
            setIsLoading(false);
        }
    }, [start, end, selectedErrorCode, selectedSite, pathname, selectedBrands, hideIntentionalCheck, prev, processData, chartProperty, activeIndex]);

    useEffect(() => {
        if (selectedBucket) {
            const bucketStart = moment(selectedBucket);
            const bucketEnd = moment(selectedBucket).add(1, 'hour');
            const query = getFciQueryString(bucketStart, bucketEnd, selectedErrorCode, selectedSite, hideIntentionalCheck, chartProperty);
            setIsModalLoading(true);
            setModalError();
            setIsModalOpen(true);
            fetch(`/getCheckoutFailures?${query}`)
                .then(checkResponse)
                .then((data) => {
                    const fcis = getTableData(data, handleOpenEdit);
                    setTableData(fcis);
                    setModalFcis(fcis);
                    setModalEditMode(false);
                })
                .catch((err) => {
                    setModalError(FETCH_FAILED_MSG);
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsModalLoading(false));
        }
    }, [selectedBucket]);

    const handleEditBack = () => {
        setModalEditMode(false);
    };

    const handleNavigationClick = (e, activeLinkIndex) => {
        setActiveIndex(activeLinkIndex);
        setSearchText('');
        updateHistory();
    };

    const handleSaveComment = (traceId, comment, isFci) => {
        const found = tableData.findIndex(({Trace}) => Trace === traceId);
        if (found > -1) {
            tableData[found].Comment = comment;
            tableData[found]['Is FCI'] = isFci;
        }
    };

    const handleModalClose = () => {
        setSelectedBucket(null);
        setIsModalOpen(false);
    };

    const handleApplyFilters = () => {
        setStart(pendingStart);
        setEnd(pendingEnd);
        setSelectedErrorCode(pendingErrorCode);
        setSelectedSite(pendingSite);
        setHideIntentionalCheck(pendingHideIntentionalCheck);
        setIsDirtyForm(false);
    };

    const handleDatetimeChange = ({start: startDateTimeStr, end: endDateTimeStr}, text) => {
        setPendingTimeRange(text || pendingTimeRange);
        setPendingStart(moment(startDateTimeStr));
        setPendingEnd(moment(endDateTimeStr));
        setIsDirtyForm(true);
    };

    const handleErrorCodeChange = (e) => {
        const selection = e || '';
        setPendingErrorCode(selection);
        setIsDirtyForm(true);
    };

    const handleSiteChange = (e) => {
        setPendingSite(e || '');
        setIsDirtyForm(true);
    };

    const handleHideIntentionalCheck = (e) => {
        setPendingHideIntentionalCheck(e?.target?.checked);
        setIsDirtyForm(true);
    };

    const handleDotClick = (selected) => {
        if (selected?.payload?.timestamp) {
            setSelectedBucket(selected.payload.timestamp);
        } else {
            setSelectedBucket(null);
        }
    };

    const handleMouseDown = (e) => {
        if (e?.activeLabel) {
            setRefAreaLeft(e.activeLabel);
        }
    };

    const handleMouseMove = (e) => {
        if (refAreaLeft && e?.activeLabel) {
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
        if (event?.target?.value) {
            setPendingErrorCode('');
            setSelectedErrorCode('');
            setChartProperty(event.target.value);
        }
    };

    const renderTrendsTab = () => (
        <>
            {isSupportedBrand && <div className="form-container">
                <DatetimeRangePicker
                    onChange={handleDatetimeChange}
                    startDate={pendingStart.toDate()}
                    endDate={pendingEnd.toDate()}
                    presets={getPresets()}
                    showTimePicker
                />
                <div className="selection-wrapper">
                    <Select
                        isMulti
                        classNamePrefix="error-code-dropdown"
                        className="error-code-dropdown"
                        options={errorCodes.map((x) => ({label: x, value: x}))}
                        onChange={handleErrorCodeChange}
                        placeholder={'All Errors'}
                        value={pendingErrorCode}
                        isSearchable
                    />
                    <Select
                        isMulti
                        classNamePrefix="site-dropdown"
                        className="site-dropdown"
                        options={getBrandSites(selectedBrands[0]).map((x) => ({label: x, value: x}))}
                        onChange={handleSiteChange}
                        placeholder={'All Sites'}
                        value={pendingSite}
                        isSearchable
                    />
                    <Checkbox
                        name="intent-cbox"
                        label="Hide Intentional Errors"
                        checked={pendingHideIntentionalCheck}
                        onChange={handleHideIntentionalCheck}
                        size="sm"
                        className="intent-cbox"
                    />
                    <button
                        className="btn btn-primary apply-btn"
                        type="button"
                        onClick={handleApplyFilters}
                        disabled={!isDirtyForm}
                    >
                        {'Apply'}
                    </button>

                </div>
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
                            helpText="Bucketed by 15 minute intervals. Note: if filtering by category, FCIs without external error codes will not be included."
                            data={lineChartData}
                            keys={lineChartKeys}
                            onDotClick={handleDotClick}
                            onMouseUp={handleMouseUp}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            refAreaLeft={refAreaLeft}
                            refAreaRight={refAreaRight}
                            enableLineHiding
                            showDot={false}
                            height={360}
                        />
                    </>
                )}
            </LoadingContainer>
        </>
    );

    const renderSearchTab = () => (
        <>
            {isSupportedBrand && <div className="form-container">
                <FormInput
                    id="search-input"
                    name="searchInput"
                    label="Search by traceid, duaid, xdid, or sessionid"
                    className="fci-search-input"
                    onChange={(event) => setSearchText(event.target.value)}
                    value={searchText}
                />
                <button
                    className="btn btn-primary apply-btn"
                    type="button"
                    onClick={searchFci}
                >
                    {'Search'}
                </button>
            </div>}
            <LoadingContainer isLoading={isLoading} error={error} className="fci-loading-container" />
        </>
    );

    return (
        <div className="fci-container">
            <h1 className="page-title">{'Failed Customer Interactions (FCI)'}</h1>
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={navLinks}
                onLinkClick={handleNavigationClick}
            />
            {activeIndex === 0 ? renderTrendsTab() : renderSearchTab()}
            <FciModal
                fci={modalFci}
                fcis={modalFcis}
                editMode={modalEditMode}
                isOpen={isModalOpen}
                onEditBack={handleEditBack}
                onClose={handleModalClose}
                onSaveComment={handleSaveComment}
                isLoading={isModalLoading}
                error={modalError}
            />
        </div>
    );
};

export default withRouter(Fci);
