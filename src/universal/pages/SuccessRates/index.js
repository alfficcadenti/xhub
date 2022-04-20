import React, {useEffect, useRef, useState} from 'react';
import {useLocation, withRouter} from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import {Alert} from '@homeaway/react-alerts';
import FilterDropDown from '../../components/FilterDropDown';
import TravelerMetricsWidget from '../../components/TravelerMetricsWidget';
import LoadingContainer from '../../components/LoadingContainer';
import RealTimeSummaryPanel from '../../components/RealTimeSummaryPanel';
import Annotations from '../../components/Annotations/Annotations';
import DateFiltersWrapper from '../../components/DateFiltersWrapper/DateFiltersWrapper';
import ResetButton from '../../components/ResetButton';
import LagIndicator from '../../components/LagIndicator';
import GrafanaDashboard from '../../components/GrafanaDashboard';
import HelpText from '../../components/HelpText/HelpText';
import {triggerEdapPageView} from '../../edap';
import {
    EG_BRAND,
    EGENCIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND,
    VRBO_BRAND
} from '../../constants';
import {
    useFetchProductMapping,
    useQueryParamChange,
    useSelectedBrand,
    useZoomAndSynced,
    useAddToUrl
} from '../hooks';
import {
    checkResponse,
    getBrand,
    makeSuccessRatesObjects,
    makeSuccessRatesLOBObjects,
    getLobPlaceholder,
    getSuccessRateGrafanaDashboard,
    brandsWithGrafanaDashboard
} from '../utils';
import {
    EPS_PARTNER_TPIDS,
    AVAILABLE_LOBS,
    NATIVE_VIEW_LABEL,
    GRAFANA_VIEW_LABEL,
    SHOPPING_RATES_LABEL,
    VIEW_TYPES,
    RATE_METRICS,
    SHOPPING_METRICS,
    LOGIN_RATES_LABEL
} from './constants';
import {
    getBrandUnsupportedMessage,
    getFetchErrorMessage,
    isMetricGroupSelected,
    isViewSelected,
    getWidgetXAxisTickGap,
    shouldShowTooltip,
    successRatesRealTimeObject,
    buildSuccessRateApiQueryString,
    getIntervalInMinutes,
    getAllAvailableLOBs,
    getQueryParams,
    getRateMetrics
} from './utils';
import './styles.less';


const SuccessRates = ({selectedBrands, onBrandChange, prevSelectedBrand, location}) => {
    const selectedBrand = selectedBrands[0];
    const [isSupportedBrand, setIsSupportedBrand] = useState(false);

    // initial states based on url query values
    const {search} = useLocation();
    const {
        initialStart, initialEnd, initialTimeRange, initialLobs,
        initialMetricGroup, initialViewType
    } = getQueryParams(search);

    // filter states
    const [viewType, setViewType] = useState(initialViewType);
    const [metricGroup, setMetricGroup] = useState(initialMetricGroup);
    const [selectedEPSPartner, setSelectedEPSPartner] = useState('');

    // real time data states
    const [realTimeTotals, setRealTimeTotals] = useState({});
    const [isRttLoading, setIsRttLoading] = useState(true);
    const [rttError, setRttError] = useState('');

    // chart widget states
    const [widgets, setWidgets] = useState([]);
    const [lobWidgets, setLoBWidgets] = useState([]);
    const [currentWidgets, setCurrentWidgets] = useState([]);

    // line of business states
    const [isLoBAvailable, setIsLoBAvailable] = useState(true);
    const [selectedLobs, setSelectedLobs] = useState(initialLobs);

    // api fetch states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // date time range picker states
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);
    const [currentTimeRange, setCurrentTimeRange] = useState(initialTimeRange);
    const [pendingTimeRange, setPendingTimeRange] = useState(initialTimeRange);
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    // chart states
    const [isZoomedIn, setIsZoomedIn] = useState(false);
    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');
    const [chartLeft, setChartLeft] = useState('dataMin');
    const [chartRight, setChartRight] = useState('dataMax');

    // annotations states
    const [enableAnnotations, setEnableAnnotations] = useState(false);
    const [filteredAnnotations, setFilteredAnnotations] = useState([]);

    // refs
    const rttRef = useRef();
    const didMount = useRef(false);


    // -----------
    // HOOKS
    // ___________

    const productMapping = useFetchProductMapping(start, end, viewType, metricGroup);

    useQueryParamChange(onBrandChange);

    useSelectedBrand(selectedBrand, prevSelectedBrand);

    useAddToUrl(selectedBrands, viewType, metricGroup, start, end, selectedLobs, pendingStart, pendingEnd);

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
        refAreaRight,
        getIntervalInMinutes(start, end)
    );

    useEffect(() => {
        triggerEdapPageView(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        if (metricGroup === LOGIN_RATES_LABEL || [EG_BRAND, EGENCIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND].includes(selectedBrand)) {
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
    }, [selectedBrand, metricGroup]);

    // Fetch Delta User Info
    useEffect(() => {
        if ([EG_BRAND, EGENCIA_BRAND].includes(selectedBrand)) {
            setIsSupportedBrand(false);
        } else if (viewType === NATIVE_VIEW_LABEL && isMetricGroupSelected(metricGroup)) {
            setIsSupportedBrand(true);
            setError(null);
            if (!isZoomedIn) { // we need this flag right after zoomed in so that we don't re-fetch because it filters on existing data
                const {label: pageBrand, funnelBrand} = getBrand(selectedBrand, 'label');
                setIsLoading(true);
                setError('');
                const interval = getIntervalInMinutes(start, end);
                const endpoint = buildSuccessRateApiQueryString({start, end, brand: funnelBrand, EPSPartner: selectedEPSPartner, interval});
                Promise.all([
                    fetch(`/v1/delta-users-counts-by-metrics?brand=${funnelBrand}&from_date=${moment(start).utc().format()}&to_date=${moment(end).utc().format()}&${selectedLobs.map((l) => `line_of_business=${l.value}`).join('&')}`),
                    ...getRateMetrics(metricGroup).map(({metricName}) => fetch(`${endpoint}&metricName=${metricName}`))
                ])
                    .then((responses) => Promise.all(responses.map(checkResponse)))
                    .then(([deltaUserData, ...fetchedSuccessRates]) => {
                        if (!fetchedSuccessRates || !fetchedSuccessRates.length) {
                            setError('No data found. Try refreshing the page or select another brand.');
                            return;
                        }

                        const successRatesLOBs = getAllAvailableLOBs(AVAILABLE_LOBS);
                        const widgetObjects = makeSuccessRatesObjects(fetchedSuccessRates, start, end, pageBrand, deltaUserData, metricGroup);
                        const widgetLOBObjects = makeSuccessRatesLOBObjects(fetchedSuccessRates, start, end, pageBrand, selectedBrand, successRatesLOBs, deltaUserData, metricGroup);
                        setWidgets(widgetObjects);
                        setLoBWidgets(widgetLOBObjects);
                    })
                    .catch((err) => setError(getFetchErrorMessage(err)))
                    .finally(() => setIsLoading(false));
            }
        } else {
            setIsSupportedBrand(true);
        }

        return function cleanup() {
            setIsZoomedIn(false); // set to false so that it fetch data when changing brands
        };
    }, [selectedBrand, start, end, selectedEPSPartner, selectedLobs, metricGroup, viewType]);

    useEffect(() => {
        const fetchRealTimeData = () => {
            if (viewType === NATIVE_VIEW_LABEL && isMetricGroupSelected(metricGroup)) {
                setIsRttLoading(true);
                setRttError('');
                const rttStart = moment().utc().subtract(11, 'minute').startOf('minute').format();
                const rttEnd = moment().utc().subtract(1, 'minute').startOf('minute').format();
                const {funnelBrand} = getBrand(selectedBrand, 'label');
                const endpoint = buildSuccessRateApiQueryString({rttStart, rttEnd, brand: funnelBrand, EPSPartner: selectedEPSPartner, interval: 1});

                Promise.all(getRateMetrics(metricGroup).map(({metricName}) => fetch(`${endpoint}&metricName=${metricName}`)))
                    .then((responses) => Promise.all(responses.map(checkResponse)))
                    .then((fetchedSuccessRates) => successRatesRealTimeObject(fetchedSuccessRates, selectedLobs, selectedBrand, metricGroup))
                    .then((realTimeData) => setRealTimeTotals(realTimeData))
                    .catch((err) => setRttError(getFetchErrorMessage(err)))
                    .finally(() => setIsRttLoading(false));
            }
        };
        if (![EG_BRAND, EGENCIA_BRAND].includes(selectedBrand)) {
            fetchRealTimeData();
            rttRef.current = setInterval(fetchRealTimeData, 60000); // refresh every minute
        }

        return function cleanup() {
            clearInterval(rttRef.current);
        };
    }, [selectedLobs, selectedEPSPartner, selectedBrand, metricGroup, viewType]);

    useEffect(() => {
        setCurrentWidgets(!selectedLobs.length
            ? widgets
            : lobWidgets);
    }, [selectedLobs, widgets, lobWidgets]);


    // -----------
    // HANDLERS
    // ___________

    const handleDatetimeChange = ({start: startDateTimeStr, end: endDateTimeStr}, text) => {
        setPendingTimeRange(text || pendingTimeRange);
        setPendingStart(moment(startDateTimeStr));
        setPendingEnd(moment(endDateTimeStr));
        setIsDirtyForm(true);
    };

    const resetGraphZoom = () => {
        setChartLeft('dataMin');
        setChartRight('dataMax');
        setRefAreaLeft('');
        setRefAreaRight('');
        setIsZoomedIn(false);
    };

    const handleViewTypeChange = (e) => setViewType(e);

    const handleMetricChange = (e) => setMetricGroup(e);

    const handleApplyFilters = () => {
        setCurrentTimeRange(pendingTimeRange);
        setStart(pendingStart);
        setEnd(pendingEnd);
        resetGraphZoom();
        setIsDirtyForm(false);
    };

    const resetGraphToDefault = () => {
        const defaultStart = moment().utc().subtract(6, 'hour');
        const defaultEnd = moment().utc();
        resetGraphZoom();
        setStart(defaultStart.format());
        setEnd(defaultEnd.format());
        setPendingStart(defaultStart);
        setPendingEnd(defaultEnd);
    };

    const handleLoBChange = (lobs) => setSelectedLobs(lobs || []);

    const handleEPSPartnerChange = (epsPartner) => {
        setSelectedEPSPartner(epsPartner === null
            ? ''
            : epsPartner.value);
    };


    // -----------
    // RENDERERS
    // ___________

    const renderWidget = ({chartName, aggregatedData, pageBrand, minValue, metricName}) => (
        <TravelerMetricsWidget
            title={chartName}
            data={aggregatedData}
            key={chartName}
            brand={pageBrand}
            metricName={metricName}
            tickGap={getWidgetXAxisTickGap(currentTimeRange)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            chartLeft={chartLeft}
            chartRight={chartRight}
            refAreaLeft={refAreaLeft}
            refAreaRight={refAreaRight}
            helpText={shouldShowTooltip(chartName, pageBrand, selectedLobs)}
            formatYAxis={(value) => `${value.toFixed()}%`}
            minChartValue={minValue}
            maxChartValue={100}
            selectedLoBs={chartName !== SHOPPING_METRICS[0].chartName ? selectedLobs : []}
            annotations={enableAnnotations ? filteredAnnotations : []}
            stacked
        />
    );

    const renderSecondaryFilters = () => (
        <div className="filters-wrapper">
            {
                metricGroup === SHOPPING_RATES_LABEL && selectedBrand === EXPEDIA_PARTNER_SERVICES_BRAND &&
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
                    metricGroup === SHOPPING_RATES_LABEL && isLoBAvailable &&
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
    );

    const renderGrafanaDashboard = () => (
        <GrafanaDashboard
            selectedBrands={[selectedBrand]}
            availableBrands={brandsWithGrafanaDashboard()}
            name="success-rates"
            url={getSuccessRateGrafanaDashboard(selectedBrand, metricGroup)}
        />
    );

    const renderSuccessRatesDashboard = () => (
        <>
            <RealTimeSummaryPanel
                realTimeTotals={realTimeTotals}
                isRttLoading ={isRttLoading}
                rttError={rttError}
                tooltipLabel={'Latest real time success rate. Refreshes every minute.'}
                label={'Real Time Success Rates'}
            />
            {viewType === NATIVE_VIEW_LABEL && isMetricGroupSelected(metricGroup) && renderSecondaryFilters()}
            <LoadingContainer isLoading={isLoading} error={error} className="success-rates-loading-container">
                <div className="success-rates-widget-container">
                    {currentWidgets.map(renderWidget)}
                </div>
            </LoadingContainer>
        </>
    );

    const renderDashboardHelpIcon = () => (
        metricGroup === SHOPPING_RATES_LABEL && !isLoBAvailable && <HelpText text="Only for LOB Hotels" placement="top" />
    );

    const renderCharts = () => viewType === GRAFANA_VIEW_LABEL
        ? renderGrafanaDashboard()
        : renderSuccessRatesDashboard();

    const renderDashboardHeader = () => (
        <div className="dashboard-header-container">
            <h1 className="page-title">
                {'Success Rates'}{renderDashboardHelpIcon()}
            </h1>
            {isSupportedBrand && metricGroup === SHOPPING_RATES_LABEL && <LagIndicator selectedBrand={selectedBrand} />}
        </div>
    );

    const renderDashboardBody = () => (
        isSupportedBrand
            ? isViewSelected(viewType) && isMetricGroupSelected(metricGroup) && renderCharts()
            : <Alert className="loading-alert" msg={getBrandUnsupportedMessage(selectedBrand)} />
    );

    const renderViewRateSelectors = () => (
        <div className="main-selectors-container">
            <FilterDropDown
                id="view-type-dropdown"
                list={VIEW_TYPES}
                selectedValue={viewType}
                onClickHandler={handleViewTypeChange}
                className="filter-dropdown"
            />
            <FilterDropDown
                id="rate-type-dropdown"
                list={RATE_METRICS}
                selectedValue={metricGroup}
                onClickHandler={handleMetricChange}
                className="filter-dropdown"
            />
        </div>
    );


    return (
        <div className="success-rates-container">
            {renderDashboardHeader()}
            {renderViewRateSelectors()}
            {renderDashboardBody()}
        </div>
    );
};

export default withRouter(SuccessRates);
