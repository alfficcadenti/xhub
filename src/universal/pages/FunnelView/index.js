import React, {useEffect, useState} from 'react';
import moment from 'moment';
import 'moment-timezone';
import Select from 'react-select';
import {Checkbox} from '@homeaway/react-form-components';
import TravelerMetricsWidget from '../../components/TravelerMetricsWidget';
import LoadingContainer from '../../components/LoadingContainer';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import HelpText from '../../components/HelpText/HelpText';
import UniversalSearch from '../../components/UniversalSearch';
import {adjustTicketProperties} from '../TicketTrends/incidentsHelper';
import {useFetchProductMapping, useQueryParamChange, useSelectedBrand, useZoomAndSynced} from '../hooks';
import {
    EG_BRAND,
    VRBO_BRAND,
    HOTELS_COM_BRAND,
    EGENCIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    DEPLOYMENT_ANNOTATION_CATEGORY,
    INCIDENT_ANNOTATION_CATEGORY,
    AB_TESTS_ANNOTATION_CATEGORY,
    LOB_LIST,
    PAGE_VIEWS_DATE_FORMAT,
} from '../../constants';
import {
    checkResponse,
    adjustInputValue,
    getBrand,
    getListOfUniqueProperties,
    getUniqueByProperty,
    addSuggestionType,
    getAnnotationsFilter,
    filterNewSelectedItems,
    bucketTime
} from '../utils';
import {makePageViewLoBObjects, makePageViewObjects} from './pageViewsUtils';
import './styles.less';

// eslint-disable-next-line complexity
const FunnelView = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const initialStart = moment().subtract(6, 'hours').startOf('minute');
    const initialEnd = moment().endOf('minute');
    const initialTimeRange = 'Last 6 hours';

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
    const [lobSelected, setLobSelected] = useState([]);

    // annotations state
    const [isDeploymentsAnnotationsLoading, setIsDeploymentsAnnotationsLoading] = useState(false);
    const [isIncidentsAnnotationsLoading, setIsIncidentsAnnotationsLoading] = useState(false);
    const [isAbTestsAnnotationsLoading, setIsAbTestsAnnotationsLoading] = useState(false);
    const [deploymentAnnotationsError, setDeploymentAnnotationsError] = useState('');
    const [incidentAnnotationsError, setIncidentAnnotationsError] = useState('');
    const [abTestsAnnotationsError, setAbTestsAnnotationsError] = useState('');

    const [enableAnnotations, setEnableAnnotations] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [selectedServiceTiers, setSelectedServiceTiers] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedPriorities, setSelectedPriorities] = useState([]);
    const [selectedAbTestsStatuses, setSelectedAbTestsStatuses] = useState([]);

    const [deploymentAnnotations, setDeploymentAnnotations] = useState([]);
    const [incidentAnnotations, setIncidentAnnotations] = useState([]);
    const [abTestsAnnotations, setAbTestsAnnotations] = useState([]);
    const [filteredAnnotations, setFilteredAnnotations] = useState([]);

    const [deploymentCategory, setDeploymentCategory] = useState(false);
    const [incidentCategory, setIncidentCategory] = useState(false);
    const [abTestsCategory, setAbTestsCategory] = useState(false);

    const [incidentPrioritySuggestions, setIncidentPrioritySuggestions] = useState([]);
    const [incidentStatusSuggestions, setIncidentStatusSuggestions] = useState([]);
    const [applicationNameSuggestions, setApplicationNameSuggestions] = useState([]);
    const [productNameSuggestions, setProductNameSuggestions] = useState([]);
    const [serviceTierSuggestions, setServiceTierSuggestions] = useState([]);
    const [abTestsStatusSuggestions, setAbTestsStatusSuggestions] = useState([]);
    const [suggestions, setSuggestions] = useState({});

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

    const filterAnnotations = (deployments, incidents, abTests) => {
        const filteredDeployments = deployments
            .filter(getAnnotationsFilter(selectedProducts, 'productName'))
            .filter(getAnnotationsFilter(selectedApplications, 'serviceName', true))
            .filter(getAnnotationsFilter(selectedServiceTiers, 'serviceTier'));

        const filteredIncidents = incidents
            .filter(getAnnotationsFilter(selectedStatuses, 'status'))
            .filter(getAnnotationsFilter(selectedPriorities, 'priority'));

        const filteredAbTests = abTests
            .filter(getAnnotationsFilter(selectedAbTestsStatuses, 'status'));

        return [
            ...filteredDeployments,
            ...filteredIncidents,
            ...filteredAbTests
        ];
    };

    useEffect(() => {
        const deployments = deploymentCategory ? deploymentAnnotations : [];
        const incidents = incidentCategory ? incidentAnnotations : [];
        const abTests = abTestsCategory ? abTestsAnnotations : [];

        setFilteredAnnotations(filterAnnotations(deployments, incidents, abTests));
    }, [
        selectedProducts,
        selectedApplications,
        selectedServiceTiers,
        selectedStatuses,
        selectedPriorities,
        selectedAbTestsStatuses
    ]);

    const filterCategories = (annotationsToFilter) => {
        const categoryOptions = [];

        if (deploymentCategory) {
            categoryOptions.push(DEPLOYMENT_ANNOTATION_CATEGORY);
        }

        if (incidentCategory) {
            categoryOptions.push(INCIDENT_ANNOTATION_CATEGORY);
        }

        if (abTestsCategory) {
            categoryOptions.push(AB_TESTS_ANNOTATION_CATEGORY);
        }

        const filteredRawAnnotations = annotationsToFilter.filter(({category}) => categoryOptions.includes(category));
        setFilteredAnnotations(filteredRawAnnotations);
    };

    const filterSuggestions = () => {
        let filteredRawSuggestions = {...suggestions};

        if (deploymentCategory) {
            addSuggestionType(filteredRawSuggestions, 'productName', productNameSuggestions);
            addSuggestionType(filteredRawSuggestions, 'serviceTier', serviceTierSuggestions);
            addSuggestionType(filteredRawSuggestions, 'applicationName', applicationNameSuggestions);
        } else {
            delete filteredRawSuggestions.applicationName;
            delete filteredRawSuggestions.productName;
            delete filteredRawSuggestions.serviceTier;
        }

        if (incidentCategory) {
            addSuggestionType(filteredRawSuggestions, 'incidentPriority', incidentPrioritySuggestions);
            addSuggestionType(filteredRawSuggestions, 'incidentStatus', incidentStatusSuggestions);
        } else {
            delete filteredRawSuggestions.incidentPriority;
            delete filteredRawSuggestions.incidentStatus;
        }

        if (abTestsCategory) {
            addSuggestionType(filteredRawSuggestions, 'abTestsStatus', abTestsStatusSuggestions);
        } else {
            delete filteredRawSuggestions.abTestsStatus;
        }

        setSuggestions(filteredRawSuggestions);
    };

    useEffect(() => {
        filterCategories(filterAnnotations(deploymentAnnotations, incidentAnnotations, abTestsAnnotations));
        filterSuggestions();
    }, [deploymentCategory, incidentCategory, abTestsCategory]);

    useEffect(() => {
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
                    const widgetObjects = makePageViewObjects(fetchedPageviews, start, end, pageBrand);
                    setWidgets(widgetObjects);
                })
                .finally(() => setIsLoading(false));
        };

        const fetchPageViewsLoBData = ([selectedBrand]) => {
            const {label: pageBrand, funnelBrand} = getBrand(selectedBrand, 'label');
            setIsLoading(true);
            setLoBError('');
            const dateQuery = start && end
                ? `&startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
                : '';
            fetch(`/v1/pageViewsLoB?brand=${funnelBrand}&timeInterval=1${dateQuery}`)
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

        const fetchDeploymentAnnotations = () => {
            setIsDeploymentsAnnotationsLoading(true);
            setDeploymentAnnotations([]);
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

                    setDeploymentAnnotations(adjustedAnnotations);
                })
                .catch((err) => {
                    setDeploymentAnnotationsError('An unexpected error has occurred loading the annotations. Try refreshing the page. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.');
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsDeploymentsAnnotationsLoading(false));
        };

        const fetchIncidentsAnnotations = () => {
            setIsIncidentsAnnotationsLoading(true);
            setIncidentAnnotations([]);
            const dateQuery = start && end
                ? `?fromDate=${moment(start).utc().format()}&toDate=${moment(end).utc().format()}`
                : '';

            fetch(`/v2/incidents${dateQuery}`)
                .then(checkResponse)
                .then((data) => {
                    const uniqueTickets = getUniqueByProperty(data, 'id');
                    const adjustedUniqueTickets = adjustTicketProperties(uniqueTickets, INCIDENT_ANNOTATION_CATEGORY)
                        .map((incident) => {
                            incident.bucketTime = bucketTime(incident.openDate, PAGE_VIEWS_DATE_FORMAT, start, end);
                            incident.time = moment.utc(incident.openDate).local().isValid() ? moment.utc(incident.openDate).local().format(PAGE_VIEWS_DATE_FORMAT) : '-';
                            incident.category = INCIDENT_ANNOTATION_CATEGORY;
                            return incident;
                        });

                    const incidentPriority = getListOfUniqueProperties(adjustedUniqueTickets, 'priority').sort();
                    const incidentStatus = getListOfUniqueProperties(adjustedUniqueTickets, 'status').sort();
                    setIncidentPrioritySuggestions(incidentPriority);
                    setIncidentStatusSuggestions(incidentStatus);
                    setIncidentAnnotations(adjustedUniqueTickets);
                    setSuggestions((prevSuggestions) => ({
                        ...prevSuggestions,
                        incidentPriority,
                        incidentStatus
                    }));
                })
                .catch((err) => {
                    setIncidentAnnotationsError('An unexpected error has occurred loading the incidents. Try refreshing the page. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.');
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsIncidentsAnnotationsLoading(false));
        };

        const fetchAbTestsAnnotations = () => {
            setIsAbTestsAnnotationsLoading(true);
            setAbTestsAnnotations([]);
            const dateQuery = start && end
                ? `?startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
                : '';

            fetch(`/abTests${dateQuery}`)
                .then(checkResponse)
                .then((data) => {
                    const adjustedAbTests = data.map((abTest) => ({
                        ...abTest,
                        status: abTest.abTestDetails.status,
                        time: moment(abTest.openedAt).format(PAGE_VIEWS_DATE_FORMAT),
                        bucketTime: moment(abTest.openedAt).format(PAGE_VIEWS_DATE_FORMAT),
                        category: AB_TESTS_ANNOTATION_CATEGORY
                    }));

                    setAbTestsAnnotations(adjustedAbTests);
                    const abTestsStatus = getListOfUniqueProperties(adjustedAbTests.map((item) => item.abTestDetails), 'status').sort();
                    setAbTestsStatusSuggestions(abTestsStatus);
                    setSuggestions((prevSuggestions) => ({
                        ...prevSuggestions,
                        abTestsStatus
                    }));
                })
                .catch((err) => {
                    setAbTestsAnnotationsError('An unexpected error has occurred loading the a/b tests. Try refreshing the page. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.');
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsAbTestsAnnotationsLoading(false));
        };

        if ([EG_BRAND, EGENCIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND, VRBO_BRAND, HOTELS_COM_BRAND].includes(selectedBrands[0])) {
            setIsLoBAvailable(false);
        } else if (isMounted) {
            fetchPageViewsLoBData(selectedBrands);
        }

        if ([EG_BRAND, EGENCIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND].includes(selectedBrands[0])) {
            setError(`Page views for ${selectedBrands} is not yet available.
                The following brands are supported at this time: "Expedia", "Hotels.com Retail", and "Vrbo Retail".
                If you have any questions, please ping #dpi-reo-opex-all or leave a comment via our Feedback form.`);
            setIsFormDisabled(true);
        } else if (isMounted) {
            setError(null);
            setIsFormDisabled(false);
            fetchPageViewsData(selectedBrands);
            fetchIncidentsAnnotations();
            fetchDeploymentAnnotations();
            fetchAbTestsAnnotations();
        }
        setIsMounted(true);
    }, [selectedBrands, start, end, isMounted]);

    useEffect(() => {
        const allAnnotations = [...deploymentAnnotations, ...incidentAnnotations];
        filterCategories(allAnnotations);
        filterSuggestions();
    }, [deploymentAnnotations, incidentAnnotations]);

    useEffect(() => {
        if (deploymentCategory || incidentCategory || abTestsCategory) {
            setEnableAnnotations(true);
        }
        if (!deploymentCategory && !incidentCategory && !abTestsCategory) {
            setEnableAnnotations(false);
        }
    }, [deploymentCategory, incidentCategory, abTestsCategory]);

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
            selectedLoB={lobSelected}
            minChartValue={minValue}
        />
    );

    const onFilterChange = (value) => {
        const adjustedInputValue = adjustInputValue(value);

        setSelectedProducts(filterNewSelectedItems(adjustedInputValue, 'productName'));
        setSelectedApplications(filterNewSelectedItems(adjustedInputValue, 'applicationName'));
        setSelectedServiceTiers(filterNewSelectedItems(adjustedInputValue, 'serviceTier'));
        setSelectedStatuses(filterNewSelectedItems(adjustedInputValue, 'incidentStatus'));
        setSelectedPriorities(filterNewSelectedItems(adjustedInputValue, 'incidentPriority'));
        setSelectedAbTestsStatuses(filterNewSelectedItems(adjustedInputValue, 'abTestsStatus'));
    };

    const handleLoBChange = (lobValue) => setLobSelected(lobValue || []);

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

    const renderPageViews = (data) => (
        <div className="page-views-widget-container">
            {data && data.length && data.map(renderWidget)}
        </div>
    );

    return (
        <div className="funnel-views-container">
            <h1>{'Traveler Page Views'}{!isLoBAvailable && <HelpText text="Only for LOB Hotels" placement="top" />}</h1>
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
                </div>
                {!isLoading && <>
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
                                />
                        }

                        <LoadingContainer
                            isLoading={isDeploymentsAnnotationsLoading || isIncidentsAnnotationsLoading || isAbTestsAnnotationsLoading}
                            error={deploymentAnnotationsError || incidentAnnotationsError || abTestsAnnotationsError}
                            className="annotations-filters-container"
                        >
                            <div className="annotations-category-filters">
                                <h4>{'Annotations:'}</h4>
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
                                <Checkbox
                                    name="incident-сheckbox"
                                    label="a/b tests"
                                    checked={abTestsCategory}
                                    onChange={() => setAbTestsCategory(!abTestsCategory)}
                                    size="sm"
                                />
                            </div>
                            <UniversalSearch
                                suggestions={suggestions}
                                suggestionMapping={productMapping}
                                onFilterChange={onFilterChange}
                            />
                        </LoadingContainer>
                    </div>
                </>}
            </div>
            <LoadingContainer isLoading={isLoading} error={!lobSelected.length ? error : LoBError} className="page-views-loading-container">
                {lobSelected && lobSelected.length && renderPageViews(lobWidgets) || renderPageViews(widgets)}
            </LoadingContainer>
        </div>
    );
};

export default FunnelView;
