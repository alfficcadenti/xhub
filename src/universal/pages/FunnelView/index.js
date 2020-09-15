import React, {useEffect, useState} from 'react';
import moment from 'moment';
import 'moment-timezone';
import TravelerMetricsWidget from '../../components/TravelerMetricsWidget';
import LoadingContainer from '../../components/LoadingContainer';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import {useFetchProductMapping, useQueryParamChange, useSelectedBrand, useZoomAndSynced} from '../hooks';
import {
    EG_BRAND,
    EGENCIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND
} from '../../constants';
import {
    checkResponse,
    filterArrayFormatted,
    getBrand,
    getListOfUniqueProperties,
    getUniqueByProperty,
    isNotEmptyString
} from '../utils';
import './styles.less';
import {adjustTicketProperties} from '../TicketTrends/incidentsHelper';
import UniversalSearch from '../../components/UniversalSearch';
import {Checkbox} from '@homeaway/react-form-components';


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
    const [enableAnnotations, setEnableAnnotations] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [selectedServiceTiers, setSelectedServiceTiers] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedPriorities, setSelectedPriorities] = useState([]);

    const [annotations, setAnnotations] = useState([]);
    const [filteredAnnotations, setFilteredAnnotations] = useState([]);

    const [deploymentCategory, setDeploymentCategory] = useState(true);
    const [incidentCategory, setIncidentCategory] = useState(true);

    const [incidentPrioritySuggestions, setIncidentPrioritySuggestions] = useState([]);
    const [incidentStatusSuggestions, setIncidentStatusSuggestions] = useState([]);
    const [applicationNameSuggestions, setApplicationNameSuggestions] = useState([]);
    const [productNameSuggestions, setProductNameSuggestions] = useState([]);
    const [serviceTierSuggestions, setServiceTierSuggestions] = useState([]);

    useQueryParamChange(selectedBrands[0], onBrandChange);
    useSelectedBrand(selectedBrands[0], onBrandChange, prevSelectedBrand);

    const productMapping = useFetchProductMapping(start, end);
    const [suggestions, setSuggestions] = useState({});

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

            fetch(`/annotations?${dateQuery}`)
                .then(checkResponse)
                .then((fetchedAnnotations) => {
                    const adjustedAnnotations = fetchedAnnotations.map((annotation) => ({
                        ...annotation,
                        tags: [annotation.productName, annotation.platform],
                        time: moment(annotation.openedAt).format(PAGE_VIEWS_DATE_FORMAT),
                        bucketTime: moment(annotation.openedAt).format(PAGE_VIEWS_DATE_FORMAT),
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
    }, [start, end]);

    useEffect(() => {
        let deploymentAnnotations = annotations.filter(({category}) => category === 'deployment');
        let incidentAnnotations = annotations.filter(({category}) => category === 'incident');

        if (selectedProducts.length) {
            deploymentAnnotations = deploymentAnnotations.filter(({productName}) => selectedProducts.includes(productName));
        }

        if (selectedApplications.length) {
            deploymentAnnotations = deploymentAnnotations.filter(({serviceName}) => selectedApplications.includes(serviceName.toLowerCase()));
        }

        if (selectedServiceTiers.length) {
            deploymentAnnotations = deploymentAnnotations.filter(({serviceTier}) => selectedServiceTiers.includes(serviceTier));
        }

        if (selectedStatuses.length) {
            incidentAnnotations = incidentAnnotations.filter(({status}) => selectedStatuses.includes(status));
        }

        if (selectedPriorities.length) {
            incidentAnnotations = incidentAnnotations.filter(({priority}) => selectedPriorities.includes(priority));
        }

        setFilteredAnnotations([...deploymentAnnotations, ...incidentAnnotations]);
    }, [
        selectedProducts,
        selectedApplications,
        selectedServiceTiers,
        selectedStatuses,
        selectedPriorities
    ]);

    useEffect(() => {
        const categoryOptions = [];
        let filteredRawSuggestions = {...suggestions};

        if (deploymentCategory) {
            categoryOptions.push('deployment');

            if (!filteredRawSuggestions.productName) {
                filteredRawSuggestions.productName = productNameSuggestions;
            }

            if (!filteredRawSuggestions.serviceTier) {
                filteredRawSuggestions.serviceTier = serviceTierSuggestions;
            }

            if (!filteredRawSuggestions.applicationName) {
                filteredRawSuggestions.applicationName = applicationNameSuggestions;
            }
        } else {
            delete filteredRawSuggestions.applicationName;
            delete filteredRawSuggestions.productName;
            delete filteredRawSuggestions.serviceTier;
        }

        if (incidentCategory) {
            categoryOptions.push('incident');

            if (!filteredRawSuggestions.incidentPriority) {
                filteredRawSuggestions.incidentPriority = incidentPrioritySuggestions;
                filteredRawSuggestions.incidentStatus = incidentStatusSuggestions;
            }
        } else {
            delete filteredRawSuggestions.incidentPriority;
            delete filteredRawSuggestions.incidentStatus;
        }

        setSuggestions(filteredRawSuggestions);

        const filteredRawAnnotations = annotations.filter(({category}) => categoryOptions.includes(category));

        setFilteredAnnotations(filteredRawAnnotations);
    }, [deploymentCategory, incidentCategory]);

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

                    const incidentPriority = getListOfUniqueProperties(adjustedUniqueTickets, 'priority').sort();
                    const incidentStatus = getListOfUniqueProperties(adjustedUniqueTickets, 'status').sort();

                    setIncidentPrioritySuggestions(incidentPriority);
                    setIncidentStatusSuggestions(incidentStatus);
                    setAnnotations((prevAnnotations) => ([...prevAnnotations, ...adjustedUniqueTickets]));
                    setSuggestions((prevSuggestions) => ({
                        ...prevSuggestions,
                        incidentPriority,
                        incidentStatus
                    }));
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };

        fetchIncidents();
    }, [start, end]);

    useEffect(() => {
        setFilteredAnnotations((prevAnnotations) => ([...prevAnnotations, ...annotations]));
    }, [annotations]);

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
            annotations={enableAnnotations ? filteredAnnotations : []}
        />
    );

    const onFilterChange = (value) => {
        const filterNewFormat = filterArrayFormatted(value);
        const hasValues = (item) => !!item.values.filter(isNotEmptyString).length;

        const productName = filterNewFormat.find((item) => item.key === 'productName');
        const newProducts = (productName && hasValues(productName)) ? productName.values : [];

        const applicationName = filterNewFormat.find((item) => item.key === 'applicationName');
        const newApplications = (applicationName && hasValues(applicationName)) ? applicationName.values : [];

        const serviceTier = filterNewFormat.find((item) => item.key === 'serviceTier');
        const newServiceTiers = (serviceTier && hasValues(serviceTier)) ? serviceTier.values : [];

        const incidentStatus = filterNewFormat.find((item) => item.key === 'incidentStatus');
        const newStatuses = (incidentStatus && hasValues(incidentStatus)) ? incidentStatus.values : [];

        const incidentPriority = filterNewFormat.find((item) => item.key === 'incidentPriority');
        const newPriorities = (incidentPriority && hasValues(incidentPriority)) ? incidentPriority.values : [];

        setSelectedProducts(newProducts);
        setSelectedApplications(newApplications);
        setSelectedServiceTiers(newServiceTiers);
        setSelectedStatuses(newStatuses);
        setSelectedPriorities(newPriorities);
    };

    useEffect(() => {
        const adjustedProducts = productMapping.map(({productName}) => productName);

        const adjustedApplications = productMapping.reduce((acc, current) => {
            return [...acc, ...current.applicationNames];
        }, []);
        const serviceTier = ['Tier 1', 'Tier 2', 'Tier 3'];

        setProductNameSuggestions(adjustedProducts);
        setApplicationNameSuggestions(adjustedApplications);
        setServiceTierSuggestions(serviceTier);

        setSuggestions((prevSuggestions) => ({
            ...prevSuggestions,
            productName: adjustedProducts,
            applicationName: adjustedApplications,
            serviceTier
        }));
    }, [productMapping]);

    return (
        <div className="funnel-views-container">
            <h1>{'Traveler Page Views'}</h1>
            <div className="filters-wrapper">
                <div className="date-filters-wrapper">
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
                    <Checkbox
                        name="annotations-сheckbox"
                        label="Show Annotations"
                        checked={enableAnnotations}
                        onChange={() => setEnableAnnotations(!enableAnnotations)}
                        size="sm"
                        className="annotations-сheckbox"
                    />
                </div>
                {!isLoading && <>
                    <div className="annotation-filters-wrapper">
                        <div className="category-filters">
                            <Checkbox
                                name="deployment-сheckbox"
                                label="deployments"
                                checked={deploymentCategory}
                                onChange={() => setDeploymentCategory(!deploymentCategory)}
                                size="sm"
                            />
                            <Checkbox
                                name="incident-сheckbox"
                                label="incidents"
                                checked={incidentCategory}
                                onChange={() => setIncidentCategory(!incidentCategory)}
                                size="sm"
                            />
                        </div>
                        <UniversalSearch
                            suggestions={suggestions}
                            suggestionMapping={productMapping}
                            onFilterChange={onFilterChange}
                        />
                    </div>
                </>}
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
