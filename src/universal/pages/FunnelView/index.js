import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import moment from 'moment';
import Select from 'react-select';
import TravelerMetricsWidget from '../../components/TravelerMetricsWidget';
import LoadingContainer from '../../components/LoadingContainer';
import DateFiltersWrapper from '../../components/DateFiltersWrapper/DateFiltersWrapper';
import Annotations from '../../components/Annotations/Annotations';
import HelpText from '../../components/HelpText/HelpText';
import {useAddToUrl, useFetchProductMapping, useQueryParamChange, useSelectedBrand, useZoomAndSynced} from '../hooks';
import {
    EG_BRAND,
    VRBO_BRAND,
    HOTELS_COM_BRAND,
    EGENCIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    LOB_LIST,
    EPS_PARTNER_SITENAMES
} from '../../constants';
import {
    checkResponse,
    getBrand,
    getQueryParams
} from '../utils';
import {makePageViewLoBObjects, makePageViewObjects, buildPageViewsApiQueryString} from './pageViewsUtils';
import './styles.less';

// eslint-disable-next-line complexity
const FunnelView = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const {search} = useLocation();
    const {initialStart, initialEnd, initialTimeRange, initialLobs} = getQueryParams(search);

    const [widgets, setWidgets] = useState([]);
    const [lobWidgets, setLoBWidgets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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

    // annotations state
    const [enableAnnotations, setEnableAnnotations] = useState(false);
    const [filteredAnnotations, setFilteredAnnotations] = useState([]);

    const [selectedEPSPartner, setSelectedEPSPartner] = useState('');

    const productMapping = useFetchProductMapping(start, end);

    const [isMounted, setIsMounted] = useState(false);

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
        pendingTimeRange
    );

    useEffect(() => {
        const fetchPageViewsData = ([selectedBrand]) => {
            const {label: pageBrand, funnelBrand} = getBrand(selectedBrand, 'label');
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
                .finally(() => setIsLoading(false));
        };

        const fetchPageViewsLoBData = ([selectedBrand]) => {
            const {label: pageBrand, funnelBrand} = getBrand(selectedBrand, 'label');
            setIsLoading(true);
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
                        ? 'Query has timed out. Try refreshing the page. If the problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.'
                        : 'An unexpected error has occurred. Try refreshing the page. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.';
                    setLoBError(errorMessage);
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsLoading(false));
        };

        if ([EG_BRAND, EGENCIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND].includes(selectedBrands[0])) {
            setIsLoBAvailable(false);
        } else if (isMounted) {
            fetchPageViewsLoBData(selectedBrands);
        }

        if ([EG_BRAND, EGENCIA_BRAND].includes(selectedBrands[0])) {
            setError(`Page views for ${selectedBrands} is not yet available.
                The following brands are supported at this time: "Expedia", "Hotels.com Retail", and "Vrbo Retail".
                If you have any questions, please ping #dpi-reo-opex-all or leave a comment via our Feedback form.`);
            setIsFormDisabled(true);
        } else if (isMounted) {
            setError(null);
            setIsFormDisabled(false);
            fetchPageViewsData(selectedBrands);
        }
        setIsMounted(true);
    }, [selectedBrands, start, end, isMounted, selectedEPSPartner]);

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
            annotations={enableAnnotations ? filteredAnnotations : []}
            selectedLoB={selectedLobs}
            minChartValue={minValue}
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

    const renderPageViews = (data) => (
        <div className="page-views-widget-container">
            {data && data.length && data.map(renderWidget) || 'No Data. Try selecting a different time frame or refreshing the page. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.'}
        </div>
    );

    return (
        <div className="funnel-views-container">
            <h1>{'Traveler Page Views'}{!isLoBAvailable && <HelpText text="Only for LOB Hotels" placement="top" />}</h1>
            <div className="filters-wrapper">
                {
                    selectedBrands[0] === EXPEDIA_PARTNER_SERVICES_BRAND ?
                        <div className="eps-partner-select-wrapper">
                            <Select
                                classNamePrefix="eps-partner-select"
                                className="eps-partner-select-container"
                                options={EPS_PARTNER_SITENAMES}
                                onChange={handleEPSPartnerChange}
                                placeholder="Select Partner"
                                isClearable
                                isSearchable
                            />
                        </div> : ''
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
                        isMounted={isMounted}
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
            <LoadingContainer isLoading={isLoading} error={!selectedLobs.length ? error : LoBError} className="page-views-loading-container">
                {selectedLobs && selectedLobs.length && renderPageViews(lobWidgets) || renderPageViews(widgets)}
            </LoadingContainer>
        </div>
    );
};

export default FunnelView;
