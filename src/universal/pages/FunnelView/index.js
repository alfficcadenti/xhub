import React, {useEffect, useState} from 'react';
import {useLocation, withRouter} from 'react-router-dom';
import moment from 'moment';
import Select from 'react-select';
import TravelerMetricsWidget from '../../components/TravelerMetricsWidget';
import LoadingContainer from '../../components/LoadingContainer';
import DateFiltersWrapper from '../../components/DateFiltersWrapper/DateFiltersWrapper';
import Annotations from '../../components/Annotations/Annotations';
import HelpText from '../../components/HelpText/HelpText';
import ResetButton from '../../components/ResetButton';
import {useAddToUrl, useFetchProductMapping, useQueryParamChange, useSelectedBrand, useZoomAndSynced} from '../hooks';
import {
    EG_BRAND,
    VRBO_BRAND,
    HOTELS_COM_BRAND,
    EGENCIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    LOB_LIST,
    EPS_PARTNER_SITENAMES,
    OPXHUB_SUPPORT_CHANNEL,
    PAGE_VIEWS_PAGE_NAME
} from '../../constants';
import {
    checkResponse,
    getBrand,
    getQueryParams,
    getLobPlaceholder
} from '../utils';
import {makePageViewLoBObjects, makePageViewObjects, buildPageViewsApiQueryString} from './pageViewsUtils';
import LagIndicator from '../../components/LagIndicator';
import './styles.less';
import {triggerEdapPageView} from '../../edap';

// eslint-disable-next-line complexity
const FunnelView = ({selectedBrands, onBrandChange, prevSelectedBrand, location}) => {
    const selectedBrand = selectedBrands[0];
    const {search} = useLocation();
    const {initialStart, initialEnd, initialTimeRange, initialLobs} = getQueryParams(search);

    const [widgets, setWidgets] = useState([]);
    const [lobWidgets, setLoBWidgets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoBLoading, setIsLoBLoading] = useState(false);
    const [error, setError] = useState('');
    const [LoBError, setLoBError] = useState('');
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [currentTimeRange, setCurrentTimeRange] = useState(initialTimeRange);
    const [pendingTimeRange, setPendingTimeRange] = useState(initialTimeRange);
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const [isLoBAvailable, setIsLoBAvailable] = useState(true);
    const [selectedLobs, setSelectedLobs] = useState(initialLobs);
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
        widgets,
        setWidgets,
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

    useEffect(() => {
        triggerEdapPageView(location.pathname);
    }, []);

    useEffect(() => {
        const fetchPageViewsData = (brand) => {
            const {label: pageBrand, funnelBrand} = getBrand(brand, 'label');
            setIsLoading(true);
            setError('');
            const endpoint = buildPageViewsApiQueryString({start, end, brand: funnelBrand, lob: false, EPSPartner: selectedEPSPartner});
            fetch(endpoint)
                .then(checkResponse)
                .then((fetchedPageviews) => {
                    if (!fetchedPageviews || !fetchedPageviews.length) {
                        setError('No data found. Try refreshing the page or select another brand.');
                        return;
                    }
                    const widgetObjects = makePageViewObjects(fetchedPageviews, start, end, pageBrand);
                    setWidgets(widgetObjects);
                })
                .catch((err) => {
                    let errorMessage = (err.message && err.message.includes('query-timeout limit exceeded'))
                        ? `Query has timed out. Try refreshing the page. If the problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`
                        : `An unexpected error has occurred. Try refreshing the page. If this problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`;
                    setLoBError(errorMessage);
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsLoading(false));
        };

        const fetchPageViewsLoBData = (brand) => {
            const {label: pageBrand, funnelBrand} = getBrand(brand, 'label');
            setIsLoBLoading(true);
            setLoBError('');
            const endpoint = buildPageViewsApiQueryString({start, end, brand: funnelBrand, lob: true, EPSPartner: selectedEPSPartner});
            fetch(endpoint)
                .then(checkResponse)
                .then((fetchedPageviews) => {
                    if (!fetchedPageviews || !fetchedPageviews.length) {
                        setLoBError('No data found. Try refreshing the page or select another brand.');
                        return;
                    }
                    const widgetObjects = makePageViewLoBObjects(fetchedPageviews, start, end, pageBrand);
                    setLoBWidgets(widgetObjects);
                })
                .catch((err) => {
                    let errorMessage = (err.message && err.message.includes('query-timeout limit exceeded'))
                        ? `Query has timed out. Try refreshing the page. If the problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`
                        : `An unexpected error has occurred. Try refreshing the page. If this problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`;
                    setLoBError(errorMessage);
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsLoBLoading(false));
        };

        if ([EG_BRAND, EGENCIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND].includes(selectedBrand)) {
            setIsLoBAvailable(false);
        } else if (!isZoomedIn) { // we need this flag right after zoomed in so that we don't re-fetch because it filters on existing data
            setIsLoBAvailable(true);
            fetchPageViewsLoBData(selectedBrand);
        }

        if ([EG_BRAND, EGENCIA_BRAND].includes(selectedBrand)) {
            setError(`Page views for ${selectedBrand} is not yet available.
                The following brands are supported at this time: "Expedia", "Hotels.com Retail", and "Vrbo Retail".
                If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`);
            setIsFormDisabled(true);
        } else {
            setError(null);
            setIsFormDisabled(false);

            if (!isZoomedIn) { // we need this flag right after zoomed in so that we don't re-fetch because it filters on existing data
                fetchPageViewsData(selectedBrand);
            }
        }

        return function cleanup() {
            setIsZoomedIn(false); // set to false so that it fetch data when changing brands
        };
    }, [selectedBrand, start, end, selectedEPSPartner]);

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

    const getWidgetXAxisTickGap = (timeRange) => [
        'Last 1 hour',
        'Last 3 hours',
        'Last 6 hours',
        'Last 12 hours',
        'Last 24 hours'
    ].includes(timeRange) ? 20 : 5;

    const renderWidget = ({chartName, aggregatedData, pageBrand, minValue}) => (
        <TravelerMetricsWidget
            title={chartName}
            data={aggregatedData}
            key={chartName}
            brand={pageBrand}
            tickGap={getWidgetXAxisTickGap(currentTimeRange)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            chartLeft={chartLeft}
            chartRight={chartRight}
            refAreaLeft={refAreaLeft}
            refAreaRight={refAreaRight}
            annotations={enableAnnotations ? filteredAnnotations : []}
            selectedLoBs={selectedLobs}
            minChartValue={minValue}
            pageName={PAGE_VIEWS_PAGE_NAME}
        />
    );

    const handleLoBChange = (lobValue) => setSelectedLobs(lobValue || []);

    const handleEPSPartnerChange = (epsPartner) => {
        if (epsPartner === null) {
            setSelectedEPSPartner('');
        } else {
            setSelectedEPSPartner(epsPartner.value);
        }
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

    const renderPageViews = (data) => (
        <div className="page-views-widget-container">
            {data && data.length && data.map(renderWidget) || `No Data. Try selecting a different time frame or refreshing the page. If this problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`}
        </div>
    );

    return (
        <div className="funnel-views-container">
            <div className="title-iframe-container">
                <h1 className="page-title">{'Traveler Page Views'}{!isLoBAvailable && <HelpText text="Only for LOB Hotels" placement="top" />}</h1>
                <LagIndicator selectedBrand={selectedBrand} />
            </div>
            <div className="filters-wrapper">
                {
                    selectedBrand === EXPEDIA_PARTNER_SERVICES_BRAND &&
                            <Select
                                classNamePrefix="eps-partner-select"
                                className="eps-partner-select-container"
                                options={EPS_PARTNER_SITENAMES}
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
                                    options={LOB_LIST}
                                    onChange={handleLoBChange}
                                    placeholder={getLobPlaceholder(isLoBLoading, lobWidgets.length)}
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
            <LoadingContainer isLoading={isLoading} error={!selectedLobs.length ? error : LoBError} className="page-views-loading-container">
                {selectedLobs && selectedLobs.length && renderPageViews(lobWidgets) || renderPageViews(widgets)}
            </LoadingContainer>
        </div>
    );
};

export default withRouter(FunnelView);
