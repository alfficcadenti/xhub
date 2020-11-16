import React, {useEffect, useState, useCallback} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import FilterDropDown from '../../components/FilterDropDown';
import LineChartWrapper from '../../components/LineChartWrapper';
import DataTable from '../../components/DataTable';
import LoadingContainer from '../../components/LoadingContainer';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import {checkResponse} from '../utils';
import {EXPEDIA_PARTNER_SERVICES_BRAND, LOB_LIST} from '../../constants';
import {getQueryValues, getQueryString, getPresets, getLineChartData, getTableData, getErrorCodes} from './utils';
import TraceLogModal from './TraceLogModal';
import {FCI_TABLE_COLUMNS, FCI_HIDDEN_TABLE_COLUMNS, SITES} from './constants';
import './styles.less';

const Fci = ({selectedBrands}) => {
    const SHOW_FILTERS = false;
    const history = useHistory();
    const {search, pathname} = useLocation();
    const {initialStart, initialEnd, initialTimeRange, initialLobs, initialErrorCode, initialSite} = getQueryValues(search);
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);
    const [selectedLobs, setSelectedLobs] = useState(initialLobs);
    const [selectedErrorCode, setSelectedErrorCode] = useState(initialErrorCode);
    const [selectedSite, setSelectedSite] = useState(initialSite);
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [pendingTimeRange, setPendingTimeRange] = useState(initialTimeRange);
    const [pendingLobs, setPendingLobs] = useState(initialLobs);
    const [pendingErrorCode, setPendingErrorCode] = useState(initialErrorCode);
    const [pendingSite, setPendingSite] = useState(initialSite);
    const [prev, setPrev] = useState({start: null, end: null, data: []});
    const [errorCodes, setErrorCodes] = useState([]);

    const [isSupportedBrand, setIsSupportedBrand] = useState(false);

    const [lineChartData, setLineChartData] = useState([]);
    const [lineChartKeys, setLineChartKeys] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({title: '', data: []});

    const handleOpenTraceLog = (id, data) => {
        setModalData({title: `Trace Log (ID=${id})`, data});
        setIsModalOpen(true);
    };

    const processData = useCallback((data) => {
        const filteredData = data.filter(({timestamp}) => moment(timestamp).isBetween(start, end, '[]', 'minute'));
        const chart = getLineChartData(start, end, filteredData, selectedErrorCode);
        setLineChartData(chart.data);
        setLineChartKeys(chart.keys);
        setTableData(getTableData(filteredData, chart.keys, handleOpenTraceLog));
        setErrorCodes(getErrorCodes(filteredData));
    }, [start, end, selectedErrorCode]);

    // eslint-disable-next-line complexity
    useEffect(() => {
        if (selectedBrands[0] !== EXPEDIA_PARTNER_SERVICES_BRAND) {
            setIsSupportedBrand(false);
            setError(`FCIs for ${selectedBrands[0]} is not yet available. For now only ${EXPEDIA_PARTNER_SERVICES_BRAND} is supported.
                If you have any questions, please ping #dpi-reo-opex-all or leave a comment via our Feedback form.`);
            return;
        }
        setIsLoading(true);
        setIsSupportedBrand(true);
        setError(null);
        const query = getQueryString(start, end, selectedLobs, selectedErrorCode, selectedSite);
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
    }, [start, end, selectedLobs, selectedErrorCode, selectedSite, history, pathname, selectedBrands, prev, processData]);

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleApplyFilters = () => {
        setStart(pendingStart);
        setEnd(pendingEnd);
        setSelectedLobs(pendingLobs);
        setSelectedErrorCode(pendingErrorCode);
        setSelectedSite(pendingSite);
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
        setPendingSite(e);
        setIsDirtyForm(true);
    };

    const handleDotClick = (selected) => {
        if (selected && selected.dataKey) {
            const errorCode = selected.dataKey;
            setPendingErrorCode(errorCode);
            setSelectedErrorCode(errorCode);
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

    return (
        <div className="fci-container">
            <h1>{'Failed Customer Interactions (FCI)'}</h1>
            <div className="form-container">
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
                <FilterDropDown
                    id="site-dropdown"
                    className="site-dropdown"
                    list={SITES}
                    selectedValue={pendingSite}
                    onClickHandler={handleSiteChange}
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
            </div>
            <LoadingContainer isLoading={isLoading} error={error} className="fci-loading-container">
                {isSupportedBrand && (
                    <LineChartWrapper
                        title="Errors over Time"
                        helpText="Error codes bucketed by 15 minute intervals"
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
