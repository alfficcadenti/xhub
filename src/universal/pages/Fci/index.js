import React, {useEffect, useState, useCallback} from 'react';
import {useHistory, useLocation, withRouter} from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import {Checkbox, RadioGroup, RadioButton, FormInput} from '@homeaway/react-form-components';
import {Navigation} from '@homeaway/react-navigation';
import Tooltip from '@homeaway/react-tooltip';
import LineChartWrapper from '../../components/LineChartWrapper';
import LoadingContainer from '../../components/LoadingContainer';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import {FETCH_FAILED_MSG} from '../../constants';
import {checkResponse, getBrand, getPresets} from '../utils';
import FciModal from './FciModal';
import DeltaUserModal from './DeltaUserModal';
import {NAV_LINKS, CATEGORY_OPTION, CODE_OPTION, CATEGORIES} from './constants';
import {
    getInitialSelectData,
    shouldFetchData,
    getIsSupportedBrand,
    getUnsupportedBrandMsg,
    getQueryValues,
    getFciQueryString,
    getHistoryQueryString,
    getTableData,
    getDeltaUserTableData
} from './utils';
import './styles.less';


const Fci = ({selectedBrands}) => {
    const history = useHistory();
    const {search, pathname} = useLocation();
    const {
        initialStart,
        initialEnd,
        initialTimeRange,
        initialErrorCode,
        initialSite,
        initialHideIntentionalCheck,
        initialSearchId,
        initialDeltaUsersId,
        initialSelectedId,
        initialIndex,
        initialBucket,
        initialLobs
    } = getQueryValues(search, selectedBrands[0]);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [activeIndex, setActiveIndex] = useState(initialIndex);

    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);
    const [selectedErrorCode, setSelectedErrorCode] = useState(initialErrorCode);
    const [selectedSite, setSelectedSite] = useState(initialSite);
    const [selectedLob, setSelectedLob] = useState(initialLobs);
    const [hideIntentionalCheck, setHideIntentionalCheck] = useState(initialHideIntentionalCheck);
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [pendingTimeRange, setPendingTimeRange] = useState(initialTimeRange);
    const [pendingErrorCode, setPendingErrorCode] = useState(initialErrorCode);
    const [pendingSite, setPendingSite] = useState(initialLobs);
    const [pendingLob, setPendingLob] = useState(initialLobs);
    const [pendingHideIntentionalCheck, setPendingHideIntentionalCheck] = useState(initialHideIntentionalCheck);
    const [selectedBucket, setSelectedBucket] = useState(initialBucket);
    const [prev, setPrev] = useState({
        start: null,
        end: null,
        data: [],
        chartProperty: null,
        selectedSite: initialSite,
        selectedErrorCode: initialErrorCode,
        selectedLob: initialLobs,
        hideIntentionalCheck: initialHideIntentionalCheck
    });
    const [errorCodesData, setErrorCodesData] = useState(getInitialSelectData(initialErrorCode));
    const [errorCodesIsLoading, setErrorCodesIsLoading] = useState(false);
    const [sitesData, setSitesData] = useState(getInitialSelectData(initialSite));
    const [sitesIsLoading, setSitesIsLoading] = useState(false);
    const [lobsData, setLobsData] = useState(getInitialSelectData(initialLobs));
    const [lobsIsLoading, setLobsIsLoading] = useState(false);
    const [searchText, setSearchText] = useState(initialSearchId);
    const [searchDeltaUsers, setSearchDeltaUsers] = useState(initialDeltaUsersId);
    const [selectedId, setSelectedId] = useState(initialSelectedId);

    const [isSupportedBrand, setIsSupportedBrand] = useState(getIsSupportedBrand(selectedBrands));

    const [chartProperty, setChartProperty] = useState(CATEGORY_OPTION);
    const [lineChartData, setLineChartData] = useState([]);
    const [lineChartKeys, setLineChartKeys] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [modalDeltaUsers, setModalDeltaUsers] = useState([]);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeltaUserModalOpen, setIsDeltaUserModalOpen] = useState(false);
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
    }, [start, end]);

    const updateHistory = (tabIndex = activeIndex, searchId = searchText, bucket = selectedBucket, id = selectedId) => {
        const historyQuery = getHistoryQueryString(selectedBrands, start, end, selectedErrorCode,
            selectedSite, selectedLob, hideIntentionalCheck, chartProperty, searchId, tabIndex, bucket, id);
        history.push(`${pathname}?${historyQuery}`);
    };

    const handleOpenEdit = (fci) => {
        setModalFci(fci);
        setModalEditMode(true);
        setIsModalOpen(true);
        setSelectedId(fci.Trace);
        updateHistory(activeIndex, searchText, selectedBucket, fci.Trace);
    };

    const processTableData = (data) => {
        const fcis = getTableData(data, handleOpenEdit);
        setTableData(fcis);
        setModalFcis(fcis);
        if (selectedId) {
            const fci = fcis.find(({Trace}) => Trace === selectedId);
            if (fci) {
                setModalFci(fci);
                setModalEditMode(true);
            }
        } else {
            setModalEditMode(false);
        }
    };

    const processDeltaUserData = (data) => {
        const deltaUsersDetails = getDeltaUserTableData(data);
        setModalDeltaUsers(deltaUsersDetails);
    };

    const searchFci = () => {
        if (!searchText) {
            return;
        }
        setIsModalLoading(true);
        setModalError();
        setIsModalOpen(true);
        updateHistory();
        fetch(`/v1/checkout-failures/search?id=${searchText}`)
            .then(checkResponse)
            .then((data) => {
                processTableData(data);
            })
            .catch((err) => {
                setModalError(FETCH_FAILED_MSG);
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsModalLoading(false));
    };

    const searchDeltaUserId = () => {
        if (!searchDeltaUsers) {
            return;
        }
        const {funnelBrand} = getBrand(selectedBrands[0], 'label');
        setIsModalLoading(true);
        setModalError();
        setIsDeltaUserModalOpen(true);
        updateHistory();
        fetch(`/v1/delta-user-by-session-id?from=${pendingStart.toISOString()}&to=${pendingEnd.toISOString()}&brand=${funnelBrand}&session_id=${searchDeltaUsers}`)
            .then(checkResponse)
            .then((data) => {
                processDeltaUserData(data);
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
        if (shouldFetchData(prev, start, end, selectedSite, selectedLob, chartProperty, selectedErrorCode, hideIntentionalCheck)) {
            const fciQuery = getFciQueryString(start, end, selectedErrorCode, selectedSite, selectedLob, hideIntentionalCheck, chartProperty);
            const url = chartProperty === CATEGORY_OPTION
                ? `/v1/checkout-failures/category-counts?${fciQuery}`
                : `/v1/checkout-failures/error-counts?${fciQuery}`;
            fetch(url)
                .then(checkResponse)
                .then((data) => {
                    setPrev({start, end, data, selectedSite, chartProperty, selectedErrorCode, selectedLob, hideIntentionalCheck});
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
    }, [start, end, selectedErrorCode, selectedSite, pathname, selectedBrands, hideIntentionalCheck, prev, processData, chartProperty, activeIndex, selectedLob]);

    useEffect(() => {
        if (selectedBucket) {
            const bucketStart = moment(selectedBucket);
            const bucketEnd = moment(selectedBucket).add(1, 'hour');
            const query = getFciQueryString(bucketStart, bucketEnd, selectedErrorCode, selectedSite, selectedLob, hideIntentionalCheck, chartProperty);
            updateHistory();
            setIsModalLoading(true);
            setModalError();
            setIsModalOpen(true);
            fetch(`/v1/checkout-failures?${query}`)
                .then(checkResponse)
                .then((data) => processTableData(data))
                .catch((err) => {
                    setModalError(FETCH_FAILED_MSG);
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsModalLoading(false));
        }
    }, [selectedBucket]);

    useEffect(() => {
        if (sitesIsLoading) {
            fetch(`/v1/checkout-failures/sites?from=${pendingStart.toISOString()}&to=${pendingEnd.toISOString()}`)
                .then(checkResponse)
                .then((data) => setSitesData({
                    start: pendingStart,
                    end: pendingEnd,
                    options: data?.map((x) => ({label: x, value: x}))
                }))
                .finally(() => setSitesIsLoading(false));
        }
    }, [pendingStart, pendingEnd, sitesIsLoading]);

    useEffect(() => {
        if (errorCodesIsLoading) {
            const path = chartProperty === CODE_OPTION
                ? '/v1/checkout-failures/error-codes'
                : '/v1/checkout-failures/error-categories';
            setErrorCodesIsLoading(true);
            fetch(`${path}?from=${pendingStart.toISOString()}&to=${pendingEnd.toISOString()}`)
                .then(checkResponse)
                .then((data) => setErrorCodesData({
                    start: pendingStart,
                    end: pendingEnd,
                    options: data.map((x) => ({label: x, value: x}))
                })
                ).finally(() => setErrorCodesIsLoading(false));
        }
    }, [pendingStart, pendingEnd, errorCodesIsLoading, chartProperty]);

    useEffect(() => {
        if (lobsIsLoading) {
            fetch(`/v1/checkout-failures/lob?from=${pendingStart.toISOString()}&to=${pendingEnd.toISOString()}&sites=${selectedSite.join(',')}`)
                .then(checkResponse)
                .then((data) => setLobsData({
                    start: pendingStart,
                    end: pendingEnd,
                    options: data.map((x) => ({label: x, value: x}))
                }))
                .finally(() => setLobsIsLoading(false));
        }
    }, [pendingStart, pendingEnd, lobsIsLoading, selectedSite]);

    const fetchSites = () => {
        if (!sitesData.start || !sitesData.start.isSame(pendingStart, 'minute')) {
            setSitesIsLoading(true);
        }
    };

    const fetchErrorCodes = () => {
        if (!errorCodesData.start || !errorCodesData.start.isSame(pendingStart, 'minute')) {
            setErrorCodesIsLoading(true);
        }
    };

    const fetchLobs = () => {
        if (!lobsData.start || !lobsData.start.isSame(pendingStart, 'minute')) {
            setLobsIsLoading(true);
        }
    };

    const handleEditBack = () => {
        setModalEditMode(false);
    };

    const handleNavigationClick = (e, activeLinkIndex) => {
        setActiveIndex(activeLinkIndex);
        setSearchText('');
        updateHistory(activeLinkIndex, null, null);
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
        setModalFci(null);
        setModalEditMode(false);
        setIsModalOpen(false);
        setSelectedId(null);
        updateHistory(activeIndex, searchText, null);
    };

    const handleDeltaUsersModalClose = () => {
        setModalFci(null);
        setIsDeltaUserModalOpen(false);
        updateHistory(activeIndex, searchText, null);
    };

    const handleApplyFilters = () => {
        setStart(pendingStart);
        setEnd(pendingEnd);
        setSelectedErrorCode(pendingErrorCode);
        setSelectedSite(pendingSite);
        setSelectedLob(pendingLob);
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

    const handleLobChange = (e) => {
        setPendingLob(e || '');
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

    // eslint-disable-next-line complexity
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
                        options={errorCodesData.options}
                        onChange={handleErrorCodeChange}
                        onFocus={fetchErrorCodes}
                        placeholder={'All Errors'}
                        defaultValue={(pendingErrorCode || []).map((e) => ({label: e, value: e}))}
                        isLoading={errorCodesIsLoading}
                        isSearchable
                    />
                    <Select
                        isMulti
                        classNamePrefix="site-dropdown"
                        className="site-dropdown"
                        options={sitesData.options}
                        onChange={handleSiteChange}
                        onFocus={fetchSites}
                        placeholder={'All Sites'}
                        defaultValue={(pendingSite || []).map((e) => ({label: e, value: e}))}
                        isLoading={sitesIsLoading}
                        isSearchable
                    />
                    <Tooltip tooltipType="tooltip--lg" content={'Line of business data only available for FCIs starting Oct 8, 2021'} placement="top">
                        <Select
                            isMulti
                            classNamePrefix="lob-dropdown"
                            className="lob-dropdown"
                            options={lobsData.options}
                            onChange={handleLobChange}
                            onFocus={fetchLobs}
                            placeholder={'All LoBs'}
                            defaultValue={(pendingLob || []).map((e) => ({label: e, value: e}))}
                            isLoading={lobsIsLoading}
                            isSearchable
                        />
                    </Tooltip>
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

    const renderDeltaUserTab = () => (
        <>
            {isSupportedBrand && <div className="form-container">
                <DatetimeRangePicker
                    onChange={handleDatetimeChange}
                    startDate={pendingStart.toDate()}
                    endDate={pendingEnd.toDate()}
                    presets={getPresets()}
                    showTimePicker
                />
                <FormInput
                    id="delta-user-input"
                    name="deltaUserInput"
                    label="Search by sessionid"
                    className="delta-user-input"
                    onChange={(event) => setSearchDeltaUsers(event.target.value)}
                    value={searchDeltaUsers}
                />
                <button
                    className="btn btn-primary apply-btn"
                    type="button"
                    onClick={searchDeltaUserId}
                >
                    {'Search'}
                </button>
            </div>}
            <LoadingContainer isLoading={isLoading} error={error} className="fci-loading-container" />
        </>
    );

    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return renderTrendsTab();
            case 1:
                return renderSearchTab();
            case 2:
                return renderDeltaUserTab();
            default:
                return renderTrendsTab();
        }
    };

    return (
        <div className="fci-container">
            <h1 className="page-title">{'Failed Customer Interactions (FCI)'}</h1>
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={NAV_LINKS}
                onLinkClick={handleNavigationClick}
            />
            {renderTabs()}
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
            <DeltaUserModal
                deltaUsersData={modalDeltaUsers}
                isOpen={isDeltaUserModalOpen}
                onClose={handleDeltaUsersModalClose}
                isLoading={isModalLoading}
                error={modalError}
            />
        </div>
    );
};

export default withRouter(Fci);
