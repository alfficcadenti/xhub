/* eslint-disable complexity */
import React, {useEffect, useRef, useState} from 'react';
import {useLocation, withRouter} from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import TravelerMetricsWidget from '../../components/TravelerMetricsWidget';
import LoadingContainer from '../../components/LoadingContainer';
import RealTimeSummaryPanel from '../../components/RealTimeSummaryPanel';
import {useFetchProductMapping, useQueryParamChange, useSelectedBrand, useZoomAndSynced, useAddToUrl} from '../hooks';
import {
    EG_BRAND,
    EGENCIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND,
    VRBO_BRAND,
    OPXHUB_SUPPORT_CHANNEL,
    SUCCESS_RATES_PAGES_LIST
} from '../../constants';
import {
    checkResponse,
    getBrand,
    makeSuccessRatesObjects,
    makeSuccessRatesLOBObjects,
    getLobPlaceholder
} from '../utils';
import HelpText from '../../components/HelpText/HelpText';
import {METRIC_NAMES, EPS_PARTNER_TPIDS, AVAILABLE_LOBS} from './constants';
import {
    getWidgetXAxisTickGap,
    shouldShowTooltip,
    successRatesRealTimeObject,
    buildSuccessRateApiQueryString,
    getTimeInterval,
    getAllAvailableLOBs,
    getQueryParams
} from './utils';
import './styles.less';
import Annotations from '../../components/Annotations/Annotations';
import DateFiltersWrapper from '../../components/DateFiltersWrapper/DateFiltersWrapper';
import ResetButton from '../../components/ResetButton';
import LagIndicator from '../../components/LagIndicator';
import {triggerEdapPageView} from '../../edap';


const SuccessRates = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const selectedBrand = selectedBrands[0];
    const {search} = useLocation();
    const {initialStart, initialEnd, initialTimeRange, initialLobs} = getQueryParams(search);

    const [realTimeTotals, setRealTimeTotals] = useState({});
    const [isRttLoading, setIsRttLoading] = useState(true);
    const [rttError, setRttError] = useState('');

    const [widgets, setWidgets] = useState([]);
    const [lobWidgets, setLoBWidgets] = useState([]);
    const [currentWidgets, setCurrentWidgets] = useState([]);
    const [isLoBAvailable, setIsLoBAvailable] = useState(true);
    const [selectedLobs, setSelectedLobs] = useState(initialLobs);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);

    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [currentTimeRange, setCurrentTimeRange] = useState(initialTimeRange);
    const [pendingTimeRange, setPendingTimeRange] = useState(initialTimeRange);
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const [isSupportedBrand, setIsSupportedBrand] = useState(false);
    const [isZoomedIn, setIsZoomedIn] = useState(false);

    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');
    const [chartLeft, setChartLeft] = useState('dataMin');
    const [chartRight, setChartRight] = useState('dataMax');

    // annotations state
    const [enableAnnotations, setEnableAnnotations] = useState(false);
    const [filteredAnnotations, setFilteredAnnotations] = useState([]);

    const [selectedEPSPartner, setSelectedEPSPartner] = useState('');
    const productMapping = useFetchProductMapping(start, end);

    useQueryParamChange(selectedBrand, onBrandChange);
    useSelectedBrand(selectedBrand, onBrandChange, prevSelectedBrand);

    const {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    } = useZoomAndSynced(
        currentWidgets,
        setCurrentWidgets,
        setPendingStart,
        setPendingEnd,
        setCurrentTimeRange,
        setStart,
        setEnd,
        setIsDirtyForm,
        pendingTimeRange,
        setIsZoomedIn,
        setRefAreaLeft,
        setRefAreaRight,
        setChartLeft,
        setChartRight,
        refAreaLeft,
        refAreaRight
    );

    const rttRef = useRef();
    const didMount = useRef(false);

    const fetchRealTimeData = () => {
        setIsRttLoading(true);
        setRttError('');
        const rttStart = moment().utc().subtract(11, 'minute').startOf('minute').format();
        const rttEnd = moment().utc().subtract(1, 'minute').startOf('minute').format();
        const {funnelBrand} = getBrand(selectedBrand, 'label');
        const endpoint = buildSuccessRateApiQueryString({rttStart, rttEnd, brand: funnelBrand, EPSPartner: selectedEPSPartner, interval: 1});

        Promise.all(METRIC_NAMES.map((metricName) => fetch(`${endpoint}&metricName=${metricName}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then((fetchedSuccessRates) => successRatesRealTimeObject(fetchedSuccessRates, selectedLobs, selectedBrand))
            .then((realTimeData) => setRealTimeTotals(realTimeData))
            .catch((err) => {
                let errorMessage = (err.message && err.message.includes('query-timeout limit exceeded'))
                    ? `Query has timed out. Try refreshing the page. If the problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`
                    : `An unexpected error has occurred. Try refreshing the page. If this problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`;
                setRttError(errorMessage);
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsRttLoading(false));
    };

    const fetchSuccessRatesData = (brand) => {
        const {label: pageBrand, funnelBrand} = getBrand(brand, 'label');
        setIsLoading(true);
        setError('');
        const interval = getTimeInterval(start, end);
        const endpoint = buildSuccessRateApiQueryString({start, end, brand: funnelBrand, EPSPartner: selectedEPSPartner, interval});
        Promise.all(METRIC_NAMES.map((metricName) => fetch(`${endpoint}&metricName=${metricName}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then((fetchedSuccessRates) => {
                if (!fetchedSuccessRates || !fetchedSuccessRates.length) {
                    setError('No data found. Try refreshing the page or select another brand.');
                    return;
                }

                const successRatesLOBs = getAllAvailableLOBs(AVAILABLE_LOBS);
                const widgetObjects = makeSuccessRatesObjects(fetchedSuccessRates, start, end, pageBrand);
                const widgetLOBObjects = makeSuccessRatesLOBObjects(fetchedSuccessRates, start, end, pageBrand, brand, successRatesLOBs);
                setWidgets(widgetObjects);
                setLoBWidgets(widgetLOBObjects);
            })
            .catch((err) => {
                let errorMessage = (err.message && err.message.includes('query-timeout limit exceeded'))
                    ? `Query has timed out. Try refreshing the page. If the problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`
                    : `An unexpected error has occurred. Try refreshing the page. If this problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`;
                setError(errorMessage);
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        triggerEdapPageView(location.pathname);
    }, []);

    useEffect(() => {
        if ([EG_BRAND, EGENCIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND].includes(selectedBrand)) {
            setIsLoBAvailable(false);
            setSelectedLobs([]);
        } else {
            setIsLoBAvailable(true);

            if (didMount.current) {
                setSelectedLobs(getAllAvailableLOBs(AVAILABLE_LOBS));
            } else {
                setSelectedLobs(initialLobs);
                didMount.current = true;
            }
        }
    }, [selectedBrand]);

    useEffect(() => {
        if ([EG_BRAND, EGENCIA_BRAND].includes(selectedBrand)) {
            setIsSupportedBrand(false);
            setError(`Success rates for ${selectedBrand} is not yet available.
                If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`);
            setIsFormDisabled(true);
        } else {
            setIsSupportedBrand(true);
            setError(null);
            setIsFormDisabled(false);

            if (!isZoomedIn) { // we need this flag right after zoomed in so that we don't re-fetch because it filters on existing data
                fetchSuccessRatesData(selectedBrand);
            }
        }

        return function cleanup() {
            setIsZoomedIn(false); // set to false so that it fetch data when changing brands
        };
    }, [selectedBrand, start, end, selectedEPSPartner]);

    useEffect(() => {
        if (![EG_BRAND, EGENCIA_BRAND].includes(selectedBrand)) {
            fetchRealTimeData();
            rttRef.current = setInterval(fetchRealTimeData, 60000); // refresh every minute
        }

        return function cleanup() {
            clearInterval(rttRef.current);
        };
    }, [selectedLobs]);

    useEffect(() => {
        if (!selectedLobs.length) {
            setCurrentWidgets(widgets);
        } else {
            setCurrentWidgets(lobWidgets);
        }
    }, [selectedLobs, widgets, lobWidgets]);

    useAddToUrl(selectedBrands, start, end, selectedLobs, pendingStart, pendingEnd);

    const handleDatetimeChange = ({start: startDateTimeStr, end: endDateTimeStr}, text) => {
        setPendingTimeRange(text || pendingTimeRange);
        setPendingStart(moment(startDateTimeStr));
        setPendingEnd(moment(endDateTimeStr));
        setIsDirtyForm(true);
    };

    const handleApplyFilters = () => {
        setCurrentTimeRange(pendingTimeRange);
        setStart(pendingStart);
        setEnd(pendingEnd);
        setIsDirtyForm(false);
    };

    const resetGraphToDefault = () => {
        const defaultStart = moment().utc().subtract(6, 'hour');
        const defaultEnd = moment().utc();
        setChartLeft('dataMin');
        setChartRight('dataMax');
        setRefAreaLeft('');
        setRefAreaRight('');
        setStart(defaultStart.format());
        setEnd(defaultEnd.format());
        setPendingStart(defaultStart);
        setPendingEnd(defaultEnd);
        setIsZoomedIn(false);
    };

    const handleLoBChange = (lobs) => setSelectedLobs(lobs || []);

    const handleEPSPartnerChange = (epsPartner) => {
        if (epsPartner === null) {
            setSelectedEPSPartner('');
        } else {
            setSelectedEPSPartner(epsPartner.value);
        }
    };

    const renderWidget = ({pageName, aggregatedData, pageBrand, minValue}) => (
        <TravelerMetricsWidget
            title={pageName}
            data={aggregatedData}
            key={pageName}
            brand={pageBrand}
            tickGap={getWidgetXAxisTickGap(currentTimeRange)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            chartLeft={chartLeft}
            chartRight={chartRight}
            refAreaLeft={refAreaLeft}
            refAreaRight={refAreaRight}
            helpText={shouldShowTooltip(pageName, pageBrand, selectedLobs)}
            formatYAxis={(value) => `${value.toFixed()}%`}
            minChartValue={minValue}
            maxChartValue={100}
            selectedLoBs={pageName !== SUCCESS_RATES_PAGES_LIST[0] ? selectedLobs : []}
            annotations={enableAnnotations ? filteredAnnotations : []}
            stacked
        />
    );

    return (
        <div className="success-rates-container">
            <div className="title-iframe-container">
                <h1 className="page-title">
                    {'Success Rates'}
                    {!isLoBAvailable && <HelpText text="Only for LOB Hotels" placement="top" />}
                </h1>
                <LagIndicator selectedBrand={selectedBrand} />
            </div>
            <div className="filters-wrapper">
                {
                    selectedBrand === EXPEDIA_PARTNER_SERVICES_BRAND &&
                        <Select
                            classNamePrefix="eps-partner-select"
                            className="eps-partner-select-container"
                            options={EPS_PARTNER_TPIDS}
                            onChange={handleEPSPartnerChange}
                            placeholder="Select Partner"
                            isClearable
                            isSearchable
                        />
                }
                <div className="dynamic-filters-wrapper">
                    {
                        isLoBAvailable &&
                            <Select
                                isMulti
                                classNamePrefix="lob-select"
                                className="lob-select-container"
                                options={getAllAvailableLOBs(AVAILABLE_LOBS)}
                                onChange={handleLoBChange}
                                placeholder={getLobPlaceholder(isLoading, lobWidgets.length)}
                                isDisabled={!lobWidgets.length}
                                defaultValue={selectedLobs}
                            />
                    }
                    <Annotations
                        productMapping={productMapping}
                        setFilteredAnnotations={setFilteredAnnotations}
                        setEnableAnnotations={setEnableAnnotations}
                        start={start}
                        end={end}
                    />
                </div>
                <DateFiltersWrapper
                    isFormDisabled={isFormDisabled}
                    pendingStart={pendingStart}
                    pendingEnd={pendingEnd}
                    handleApplyFilters={handleApplyFilters}
                    handleDatetimeChange={handleDatetimeChange}
                    isDirtyForm={isDirtyForm}
                    showTimePicker
                />
                <ResetButton
                    isDisabled={moment(end).diff(moment(start), 'hour') === 6}
                    resetGraphToDefault={resetGraphToDefault}
                />
            </div>
            {isSupportedBrand && (
                <RealTimeSummaryPanel
                    realTimeTotals={realTimeTotals}
                    isRttLoading={isRttLoading}
                    rttError={rttError}
                    tooltipLabel={'Latest real time success rate. Refreshes every minute.'}
                    label={'Real Time Success Rates'}
                />
            )}
            <LoadingContainer isLoading={isLoading} error={error} className="success-rates-loading-container">
                <div className="success-rates-widget-container">
                    {currentWidgets.map(renderWidget)}
                </div>
            </LoadingContainer>
        </div>
    );
};

export default withRouter(SuccessRates);
