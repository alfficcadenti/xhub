import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import FilterDropDown from '../../components/FilterDropDown';
import LineChartWrapper from '../../components/LineChartWrapper';
import DataTable from '../../components/DataTable';
import LoadingContainer from '../../components/LoadingContainer';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import {checkResponse} from '../utils';
import {LOB_LIST} from '../../constants';
import {getQueryValues, getQueryString, getPresets, getLineChartData, getTableData, getErrorCodes} from './utils';
import TraceLogModal from './TraceLogModal';
import {FCI_TABLE_COLUMNS} from './constants';
import './styles.less';

const Fci = ({selectedBrands}) => {
    const SHOW_FILTERS = false;
    const history = useHistory();
    const {search, pathname} = useLocation();
    const {initialStart, initialEnd, initialTimeRange, initialLobs, initialErrorCode} = getQueryValues(search);
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);
    const [selectedLobs, setSelectedLobs] = useState(initialLobs);
    const [selectedErrorCode, setSelectedErrorCode] = useState(initialErrorCode);
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [pendingTimeRange, setPendingTimeRange] = useState(initialTimeRange);
    const [pendingLobs, setPendingLobs] = useState(initialLobs);
    const [pendingErrorCode, setPendingErrorCode] = useState(initialErrorCode);
    const [errorCodes, setErrorCodes] = useState([]);

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

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        const query = getQueryString(start, end, selectedLobs, selectedErrorCode);
        fetch(`/getCheckoutFailures?${query}`)
            .then(checkResponse)
            .then((data) => {
                const chart = getLineChartData(start, end, data, selectedErrorCode);
                setLineChartData(chart.data);
                setLineChartKeys(chart.keys);
                setTableData(getTableData(data, chart.keys, handleOpenTraceLog));
                setErrorCodes(getErrorCodes(data));
                history.push(`${pathname}?selectedBrand=${selectedBrands[0]}&${query}`);
            })
            .catch((err) => {
                setError('Failed to retrieve FCI data. Try refreshing the page. '
                    + 'If the problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.');
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsLoading(false));
    }, [start, end, selectedLobs, selectedErrorCode, history, pathname, selectedBrands]);

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleApplyFilters = () => {
        setStart(pendingStart);
        setEnd(pendingEnd);
        setSelectedLobs(pendingLobs);
        setSelectedErrorCode(pendingErrorCode);
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
                <DataTable
                    title={`FCIs (${tableData.length} results)`}
                    data={tableData}
                    columns={FCI_TABLE_COLUMNS}
                    columnsInfo={{LoB: <div>{'Line of Business'}</div>}}
                    paginated
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
