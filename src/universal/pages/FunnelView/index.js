import React, {useEffect, useState} from 'react';
import moment from 'moment';
import 'moment-timezone';
import TravelerMetricsWidget from '../../components/TravelerMetricsWidget';
import LoadingContainer from '../../components/LoadingContainer';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import AnnotationsFilterPanel from '../../components/AnnotationsFilterPanel';
import {useQueryParamChange, useSelectedBrand, useZoomAndSynced} from '../hooks';
import {
    EG_BRAND,
    EGENCIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND
} from '../../constants';
import {
    checkResponse,
    getBrand,
    getUniqueByProperty
} from '../utils';
import './styles.less';
import {adjustTicketProperties} from '../TicketTrends/incidentsHelper';

const initialCategories = [{value: 'Application Software', label: 'Deployments'}];

const TIMEZONE_OFFSET = (new Date()).getTimezoneOffset();
const TIMEZONE_ABBR = moment.tz.zone(moment.tz.guess()).abbr(TIMEZONE_OFFSET);
const PAGE_VIEWS_DATE_FORMAT = 'YYYY-MM-DD HH:mm';


const FunnelView = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const initialStart = moment().subtract(6, 'hours').startOf('minute');
    const initialEnd = moment().endOf('minute');
    const initialTimeRange = 'Last 6 hours';

    const [widgets, setWidgets] = useState([]);
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

    // annotations state
    const [enableAlerts, setEnableAlerts] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(initialCategories);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [annotations, setAnnotations] = useState([]);

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

    const PAGES_LIST = [
        {name: 'home', label: 'Home'},
        {name: 'searchresults', label: 'Search'},
        {name: 'property', label: 'Property'},
        {name: 'bookingform', label: 'Booking Form'},
        {name: 'bookingconfirmation', label: 'Booking Confirmation'},
    ];
    const getNowDate = () => moment().endOf('minute').toDate();
    const getLastDate = (value, unit) => moment().subtract(value, unit).startOf('minute').toDate();
    const getValue = (value, unit) => ({start: getLastDate(value, unit), end: getNowDate()});
    const getPresets = () => [
        {text: 'Last 15 minutes', value: getValue(15, 'minutes')},
        {text: 'Last 30 minutes', value: getValue(30, 'minutes')},
        {text: 'Last 1 hour', value: getValue(1, 'hour')},
        {text: 'Last 3 hours', value: getValue(3, 'hours')},
        {text: 'Last 6 hours', value: getValue(6, 'hours')},
        {text: 'Last 12 hours', value: getValue(12, 'hours')},
        {text: 'Last 24 hours', value: getValue(24, 'hours')}
    ];

    const fetchPageViewsData = ([selectedBrand]) => {
        const {label: pageBrand, funnelBrand} = getBrand(selectedBrand, 'label');
        setIsLoading(true);
        setError('');
        const dateQuery = start && end
            ? `&startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
            : '';
        fetch(`/v1/pageViews?brand=${funnelBrand}&timeInterval=1${dateQuery}`)
            .then(checkResponse)
            .then((fetchedPageviews) => {
                if (!fetchedPageviews || !fetchedPageviews.length) {
                    setError('No data found. Try refreshing the page or select another brand.');
                    return;
                }
                const widgetObjects = PAGES_LIST.map(({name, label}) => {
                    const aggregatedData = [];
                    fetchedPageviews.forEach(({time, pageViewsData}) => {
                        const currentPageViews = pageViewsData.find((item) => item.page === name);
                        if (currentPageViews) {
                            const momentTime = moment(time);
                            if (momentTime.isBetween(start, end, 'minutes', '[]')) {
                                aggregatedData.push({
                                    label: `${momentTime.format(PAGE_VIEWS_DATE_FORMAT)} ${TIMEZONE_ABBR}`,
                                    time: momentTime.format(PAGE_VIEWS_DATE_FORMAT),
                                    momentTime,
                                    value: currentPageViews.views
                                });
                            }
                        }
                    });
                    return {pageName: label, aggregatedData, pageBrand};
                });
                setWidgets(widgetObjects);
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
        if ([EG_BRAND, EGENCIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND].includes(selectedBrands[0])) {
            setError(`Page views for ${selectedBrands} is not yet available.
                The following brands are supported at this time: "Expedia", "Hotels.com Retail", and "Vrbo Retail".
                If you have any questions, please ping #dpi-reo-opex-all or leave a comment via our Feedback form.`);
            setIsFormDisabled(true);
        } else {
            setError(null);
            setIsFormDisabled(false);
            fetchPageViewsData(selectedBrands);
        }
    }, [selectedBrands, start, end]);

    useEffect(() => {
        const fetchAnnotations = () => {
            const dateQuery = start && end
                ? `&startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
                : '';
            const categoryQuery = selectedCategories && selectedCategories.length ? `&category=${selectedCategories[0].value}` : '';
            const productsQuery = selectedProducts && selectedProducts.length ? `&product=${selectedProducts}` : '';
            const applicationsQuery = selectedApplications && selectedApplications.length ? `&applicationName=${selectedApplications}` : '';

            fetch(`/annotations?${dateQuery}${productsQuery}${applicationsQuery}${categoryQuery}`)
                .then(checkResponse)
                .then((fetchedAnnotations) => {
                    const adjustedAnnotations = fetchedAnnotations.map(({
                        number,
                        serviceName,
                        productName,
                        platform,
                        openedAt
                    }) => ({
                        number,
                        serviceName,
                        tags: [productName, platform],
                        time: moment(openedAt).format(PAGE_VIEWS_DATE_FORMAT),
                        bucketTime: moment(openedAt).format(PAGE_VIEWS_DATE_FORMAT),
                        category: 'deployment'
                    }));

                    setAnnotations((prevAnnotations) => ([...prevAnnotations, ...adjustedAnnotations]));
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };

        fetchAnnotations();
    }, [start, end, selectedCategories, selectedProducts, selectedApplications]);

    useEffect(() => {
        const fetchIncidents = () => {
            const dateQuery = start && end
                ? `?fromDate=${moment(start).utc().format()}&toDate=${moment(end).utc().format()}`
                : '';

            fetch(`/v2/incidents${dateQuery}`)
                .then(checkResponse)
                .then((data) => {
                    const uniqueTickets = getUniqueByProperty(data, 'id');
                    const adjustedUniqueTickets = adjustTicketProperties(uniqueTickets, 'incident')
                        .map((incident) => {
                            incident.bucketTime = moment(incident.openDate).format(PAGE_VIEWS_DATE_FORMAT);
                            incident.time = moment(incident.openDate).format(PAGE_VIEWS_DATE_FORMAT);
                            incident.category = 'incident';

                            return incident;
                        });

                    setAnnotations((prevAnnotations) => ([...prevAnnotations, ...adjustedUniqueTickets]));
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };

        fetchIncidents();
    }, [start, end]);

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

    const renderWidget = ({pageName, aggregatedData, pageBrand}) => (
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
            annotations={enableAlerts ? annotations : []}
        />
    );

    return (
        <div className="funnel-views-container">
            <h1>{'Traveler Page Views'}</h1>
            <div className="form-container">
                <DatetimeRangePicker
                    onChange={handleDatetimeChange}
                    startDate={pendingStart.toDate()}
                    endDate={pendingEnd.toDate()}
                    presets={getPresets()}
                    disabled={isFormDisabled}
                />
                <button
                    className="btn btn-primary apply-btn"
                    type="button"
                    onClick={handleApplyFilters}
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
                <AnnotationsFilterPanel
                    enableAlerts={enableAlerts}
                    setEnableAlerts={setEnableAlerts}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                    selectedApplications={selectedApplications}
                    setSelectedApplications={setSelectedApplications}
                    start={start}
                    end={end}
                />
            </div>
            <LoadingContainer isLoading={isLoading} error={error} className="page-views-loading-container">
                <div className="page-views-widget-container">
                    {widgets.map(renderWidget)}
                </div>
            </LoadingContainer>
        </div>
    );
};

export default FunnelView;
