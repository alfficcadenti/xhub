/* eslint-disable complexity */
import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
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
    LOB_LIST,
    VRBO_BRAND
} from '../../constants';
import {
    checkResponse,
    getBrand,
    makeSuccessRatesObjects,
    makeSuccessRatesLOBObjects,
    getQueryParams
} from '../utils';
import HelpText from '../../components/HelpText/HelpText';
import {SUCCESS_RATES_PAGES_LIST, METRIC_NAMES} from './constants';
import {
    getWidgetXAxisTickGap,
    shouldShowTooltip,
    successRatesRealTimeObject,
    getTimeInterval
} from './utils';
import './styles.less';
import Annotations from '../../components/Annotations/Annotations';
import DateFiltersWrapper from '../../components/DateFiltersWrapper/DateFiltersWrapper';


const SuccessRates = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
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

    // annotations state
    const [enableAnnotations, setEnableAnnotations] = useState(false);
    const [filteredAnnotations, setFilteredAnnotations] = useState([]);

    const productMapping = useFetchProductMapping(start, end);

    useQueryParamChange(selectedBrands[0], onBrandChange);
    useSelectedBrand(selectedBrands[0], onBrandChange, prevSelectedBrand);

    const {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        chartLeft,
        chartRight,
        refAreaLeft,
        refAreaRight
    } = useZoomAndSynced(
        widgets,
        setWidgets,
        setPendingStart,
        setPendingEnd,
        setCurrentTimeRange,
        setStart,
        setEnd,
        setIsDirtyForm,
        pendingTimeRange,
        setIsZoomedIn
    );

    const rttRef = useRef();

    const fetchRealTimeData = ([selectedBrand]) => {
        setIsRttLoading(true);
        setRttError('');
        const now = moment();
        const rttStart = moment(now).subtract(11, 'minute').startOf('minute');
        const rttEnd = moment(now).subtract(1, 'minute').startOf('minute');
        const dateQuery = `&startDate=${rttStart.utc().format()}&endDate=${rttEnd.utc().format()}`;
        const {funnelBrand} = getBrand(selectedBrand, 'label');

        Promise.all(METRIC_NAMES.map((metricName) => fetch(`/user-events-api/v1/funnelView?brand=${funnelBrand}&metricName=${metricName}${dateQuery}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then((fetchedSuccessRates) => successRatesRealTimeObject(fetchedSuccessRates, selectedLobs, selectedBrand))
            .then((realTimeData) => setRealTimeTotals(realTimeData))
            .catch((err) => {
                let errorMessage = (err.message && err.message.includes('query-timeout limit exceeded'))
                    ? 'Query has timed out. Try refreshing the page. If the problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.'
                    : 'An unexpected error has occurred. Try refreshing the page. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.';
                setRttError(errorMessage);
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsRttLoading(false));
    };

    const fetchSuccessRatesData = ([selectedBrand]) => {
        const {label: pageBrand, funnelBrand} = getBrand(selectedBrand, 'label');
        setIsLoading(true);
        setError('');
        const interval = getTimeInterval(start, end);
        const dateQuery = start && end
            ? `&startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
            : '';
        const lobQuery = selectedLobs.length
            ? `&lineOfBusiness=${selectedLobs.map((lob) => lob.value).join(',')}`
            : '';
        Promise.all(METRIC_NAMES.map((metricName) => fetch(`/user-events-api/v1/funnelView?brand=${funnelBrand}&metricName=${metricName}${dateQuery}${lobQuery}&timeInterval=${interval}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then((fetchedSuccessRates) => {
                if (!fetchedSuccessRates || !fetchedSuccessRates.length) {
                    setError('No data found. Try refreshing the page or select another brand.');
                    return;
                }

                const successRatesLOBs = LOB_LIST.filter(({value}) => ['H', 'C'].includes(value));

                const widgetObjects = makeSuccessRatesObjects(fetchedSuccessRates, start, end, pageBrand);
                const widgetLOBObjects = makeSuccessRatesLOBObjects(fetchedSuccessRates, start, end, pageBrand, selectedBrand, successRatesLOBs);

                setWidgets(widgetObjects);
                setLoBWidgets(widgetLOBObjects);
            })
            .catch((err) => {
                let errorMessage = (err.message && err.message.includes('query-timeout limit exceeded'))
                    ? 'Query has timed out. Try refreshing the page. If the problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.'
                    : 'An unexpected error has occurred. Try refreshing the page. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.';
                setError(errorMessage);
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if ([EG_BRAND, EGENCIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND].includes(selectedBrands[0])) {
            setIsLoBAvailable(false);
        }

        if ([EG_BRAND, EGENCIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND, HOTELS_COM_BRAND].includes(selectedBrands[0])) {
            setIsSupportedBrand(false);
            setError(`Success rates for ${selectedBrands} is not yet available.
                If you have any questions, please ping #dpi-reo-opex-all or leave a comment via our Feedback form.`);
            setIsFormDisabled(true);
        } else {
            setIsSupportedBrand(true);
            setError(null);
            setIsFormDisabled(false);
            fetchRealTimeData(selectedBrands);
            rttRef.current = setInterval(fetchRealTimeData.bind(null, selectedBrands), 60000); // refresh every minute

            if (!isZoomedIn) {
                fetchSuccessRatesData(selectedBrands);
            }
        }
        return function cleanup() {
            clearInterval(rttRef.current);
            setIsZoomedIn(false);
        };
    }, [selectedBrands, start, end]);

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

    const handleLoBChange = (lobs) => setSelectedLobs(lobs || []);

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
            selectedLoB={pageName !== SUCCESS_RATES_PAGES_LIST[0] ? selectedLobs : []}
            annotations={enableAnnotations ? filteredAnnotations : []}
            stacked
        />
    );

    return (
        <div className="success-rates-container">
            <h1>
                {'Success Rates'}
                {!isLoBAvailable && <HelpText text="Only for LOB Hotels" placement="top" />}
            </h1>
            <div className="filters-wrapper">
                <div className="dynamic-filters-wrapper">
                    {
                        isLoBAvailable &&
                            <Select
                                isMulti
                                classNamePrefix="lob-select"
                                className="lob-select-container"
                                options={LOB_LIST.filter(({value}) => ['H', 'C'].includes(value))}
                                onChange={handleLoBChange}
                                placeholder={lobWidgets.length ? 'Select Line of Business' : 'Line of Business Data not available. Try to refresh'}
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
                        isMounted={isZoomedIn}
                    />
                </div>
                <DateFiltersWrapper
                    isFormDisabled={isFormDisabled}
                    pendingStart={pendingStart}
                    pendingEnd={pendingEnd}
                    handleApplyFilters={handleApplyFilters}
                    handleDatetimeChange={handleDatetimeChange}
                    isDirtyForm={isDirtyForm}
                />
            </div>
            {isSupportedBrand && (
                <RealTimeSummaryPanel
                    realTimeTotals={realTimeTotals}
                    isRttLoading={isRttLoading}
                    rttError={rttError}
                    tooltipLabel={'Latest real time success rate. Refreshes every minute.'}
                    label={'Real Time Success Rates'}
                    showPercentageSign
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

export default SuccessRates;
