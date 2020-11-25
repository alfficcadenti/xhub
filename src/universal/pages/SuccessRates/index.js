/* eslint-disable complexity */
import React, {useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import TravelerMetricsWidget from '../../components/TravelerMetricsWidget';
import LoadingContainer from '../../components/LoadingContainer';
import RealTimeSummaryPanel from '../../components/RealTimeSummaryPanel';
import {useFetchProductMapping, useQueryParamChange, useSelectedBrand, useZoomAndSynced} from '../hooks';
import {
    EG_BRAND,
    EGENCIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND,
    DEPLOYMENT_ANNOTATION_CATEGORY,
    INCIDENT_ANNOTATION_CATEGORY,
    AB_TESTS_ANNOTATION_CATEGORY,
    LOB_LIST
} from '../../constants';
import {
    addSuggestionType,
    adjustInputValue,
    checkResponse,
    filterNewSelectedItems,
    getAnnotationsFilter,
    getBrand, getListOfUniqueProperties, getUniqueByProperty,
    makeSuccessRatesObjects,
    makeSuccessRatesLOBObjects
} from '../utils';
import HelpText from '../../components/HelpText/HelpText';
import {SUCCESS_RATES_PAGES_LIST, METRIC_NAMES} from './constants';
import {
    getQueryParams,
    getWidgetXAxisTickGap,
    shouldShowTooltip,
    successRatesRealTimeObject
} from './utils';
import './styles.less';
import {adjustTicketProperties} from '../TicketTrends/incidentsHelper';
import Annotations from '../../components/Annotations/Annotations';
import DateFiltersWrapper from '../../components/DateFiltersWrapper/DateFiltersWrapper';


const SuccessRates = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const history = useHistory();
    const {search, pathname} = useLocation();
    const {initialStart, initialEnd, initialTimeRange, initialLobs} = getQueryParams(search);

    const [realTimeTotals, setRealTimeTotals] = useState({});
    const [isRttLoading, setIsRttLoading] = useState(true);
    const [rttError, setRttError] = useState('');

    const [widgets, setWidgets] = useState([]);
    const [lobWidgets, setLoBWidgets] = useState([]);
    const [currentWidgets, setCurrentWidgets] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);

    // const [selectedLobs, setSelectedLobs] = useState(initialLobs);
    const [selectedLobs, setSelectedLobs] = useState([]);

    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [currentTimeRange, setCurrentTimeRange] = useState(initialTimeRange);
    const [pendingTimeRange, setPendingTimeRange] = useState(initialTimeRange);
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const [isSupportedBrand, setIsSupportedBrand] = useState(false);
    const [isZoomedIn, setIsZoomedIn] = useState(false);

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

        Promise.all(METRIC_NAMES.map((metricName) => fetch(`https://localhost:8085/v1/funnelView?brand=${funnelBrand}&metricName=${metricName}${dateQuery}`)))
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
        const dateQuery = start && end
            ? `&startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
            : '';
        const lobQuery = selectedLobs.length
            ? `&lineOfBusiness=${selectedLobs.map((lob) => lob.value).join(',')}`
            : '';
        Promise.all(METRIC_NAMES.map((metricName) => fetch(`https://localhost:8085/v1/funnelView?brand=${funnelBrand}&metricName=${metricName}${dateQuery}${lobQuery}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then((fetchedSuccessRates) => {
                if (!fetchedSuccessRates || !fetchedSuccessRates.length) {
                    setError('No data found. Try refreshing the page or select another brand.');
                    return;
                }

                const successRatesLOBs = LOB_LIST.filter(({value}) => ['H', 'C'].includes(value));

                // const widgetObjects = makeSuccessRatesObjects(fetchedSuccessRates, start, end, pageBrand, selectedBrand, selectedLobs);
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
                        time: moment.utc(annotation.openedAt).valueOf(),
                        category: 'deployment'
                    }));

                    setDeploymentAnnotations(adjustedAnnotations);
                })
                .catch((err) => {
                    setDeploymentAnnotationsError(true);
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
                            incident.time = moment.utc(incident.openDate).local().isValid() ? moment.utc(incident.openDate).valueOf() : '-';
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
                    setIncidentAnnotationsError(true);
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
                        time: moment.utc(abTest.openedAt).local().isValid() ? moment.utc(abTest.openedAt).valueOf() : '-',
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
                    setAbTestsAnnotationsError(true);
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsAbTestsAnnotationsLoading(false));
        };

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
            history.push(`${pathname}?selectedBrand=${selectedBrands[0]}`
                + `&start=${pendingStart.format()}`
                + `&end=${pendingEnd.format()}`
                + `&lobs=${selectedLobs.map((l) => l.value).join(',')}`
            );
            if (!isZoomedIn) {
                fetchSuccessRatesData(selectedBrands);
                fetchIncidentsAnnotations();
                fetchDeploymentAnnotations();
                fetchAbTestsAnnotations();
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
    }, [selectedLobs]);

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

    const handleLoBChange = (lobs) => {
        setSelectedLobs(lobs || []);
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
            selectedLoB={pageName !== SUCCESS_RATES_PAGES_LIST[0] ? selectedLobs : []}
            annotations={enableAnnotations ? filteredAnnotations : []}
            stacked
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

    return (
        <div className="success-rates-container">
            <h1>
                {'Success Rates'}
                <HelpText text="Only for LOB Hotels" placement="top" />
            </h1>
            <div className="filters-wrapper">
                <div className="dynamic-filters-wrapper">
                    <Select
                        isMulti
                        classNamePrefix="lob-select"
                        className="lob-select-container"
                        options={LOB_LIST.filter(({value}) => ['H', 'C'].includes(value))}
                        placeholder={'Select Line of Business'}
                        onChange={handleLoBChange}
                    />
                    <Annotations
                        isDeploymentsAnnotationsLoading={isDeploymentsAnnotationsLoading}
                        isIncidentsAnnotationsLoading={isIncidentsAnnotationsLoading}
                        isAbTestsAnnotationsLoading={isAbTestsAnnotationsLoading}
                        deploymentAnnotationsError={deploymentAnnotationsError}
                        incidentAnnotationsError={incidentAnnotationsError}
                        abTestsAnnotationsError={abTestsAnnotationsError}
                        deploymentCategory={deploymentCategory}
                        incidentCategory={incidentCategory}
                        abTestsCategory={abTestsCategory}
                        setDeploymentCategory={setDeploymentCategory}
                        setIncidentCategory={setIncidentCategory}
                        setAbTestsCategory={setAbTestsCategory}
                        suggestions={suggestions}
                        productMapping={productMapping}
                        onFilterChange={onFilterChange}
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
