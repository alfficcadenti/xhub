import React, {useState, useRef, useEffect} from 'react';
import UniversalSearch from '../UniversalSearch';
import {SVGIcon} from '@homeaway/react-svg';
import {FILTER__16} from '@homeaway/svg-defs';
import {Checkbox} from '@homeaway/react-form-components';
import LoadingContainer from '../LoadingContainer';
import './styles.less';
import {
    addSuggestionType, adjustInputValue,
    checkResponse, filterNewSelectedItems,
    getAnnotationsFilter,
    getListOfUniqueProperties,
    getUniqueByProperty
} from '../../pages/utils';
import moment from 'moment';
import {adjustTicketProperties} from '../../pages/TicketTrends/incidentsHelper';
import {
    AB_TESTS_ANNOTATION_CATEGORY, DEPLOYMENT_ANNOTATION_CATEGORY,
    INCIDENT_ANNOTATION_CATEGORY, OPXHUB_SUPPORT_CHANNEL
} from '../../constants';


const Annotations = ({
    productMapping,
    setFilteredAnnotations,
    setEnableAnnotations,
    start,
    end
}) => {
    const [isDeploymentsAnnotationsLoading, setIsDeploymentsAnnotationsLoading] = useState(false);
    const [isIncidentsAnnotationsLoading, setIsIncidentsAnnotationsLoading] = useState(false);
    const [isAbTestsAnnotationsLoading, setIsAbTestsAnnotationsLoading] = useState(false);
    const [deploymentAnnotationsError, setDeploymentAnnotationsError] = useState(false);
    const [incidentAnnotationsError, setIncidentAnnotationsError] = useState(false);
    const [abTestsAnnotationsError, setAbTestsAnnotationsError] = useState(false);

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [selectedServiceTiers, setSelectedServiceTiers] = useState(['Tier 1']);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedPriorities, setSelectedPriorities] = useState([]);
    const [selectedAbTestsStatuses, setSelectedAbTestsStatuses] = useState([]);

    const [deploymentAnnotations, setDeploymentAnnotations] = useState([]);
    const [incidentAnnotations, setIncidentAnnotations] = useState([]);
    const [abTestsAnnotations, setAbTestsAnnotations] = useState([]);

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

    const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
    const [displayError, setDisplayError] = useState('');
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setOpenAdvancedFilter(false);
        }
    };

    const filterAnnotations = (deployments, incidents, abTests) => {
        const filteredDeployments = deployments
            .filter(getAnnotationsFilter(selectedProducts, 'product_name'))
            .filter(getAnnotationsFilter(selectedApplications, 'service_name', true))
            .filter(getAnnotationsFilter(selectedServiceTiers, 'service_tier'));

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
            addSuggestionType(filteredRawSuggestions, 'product_name', productNameSuggestions);
            addSuggestionType(filteredRawSuggestions, 'service_tier', serviceTierSuggestions);
            addSuggestionType(filteredRawSuggestions, 'application_name', applicationNameSuggestions);
        } else {
            delete filteredRawSuggestions.application_name;
            delete filteredRawSuggestions.product_name;
            delete filteredRawSuggestions.service_tier;
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
        const fetchDeploymentAnnotations = () => {
            setIsDeploymentsAnnotationsLoading(true);
            setDeploymentAnnotations([]);
            const dateQuery = start && end
                ? `&from_datetime=${moment(start).utc().format()}&to_datetime=${moment(end).utc().format()}`
                : '';

            fetch(`/deployments?${dateQuery}`)
                .then(checkResponse)
                .then((fetchedAnnotations) => {
                    if (fetchedAnnotations?.error) {
                        throw new Error('Error occurred when fetching annotations');
                    }
                    const adjustedAnnotations = fetchedAnnotations.map((annotation) => ({
                        ...annotation,
                        tags: [annotation.product_name, annotation.platform],
                        time: moment.utc(annotation.opened_at).valueOf(),
                        category: 'deployment'
                    }));

                    setDeploymentAnnotations(adjustedAnnotations);
                })
                .catch((err) => {
                    setDeploymentAnnotationsError(true);
                    console.error(err);
                })
                .finally(() => setIsDeploymentsAnnotationsLoading(false));
        };

        const fetchIncidentsAnnotations = () => {
            setIsIncidentsAnnotationsLoading(true);
            setIncidentAnnotations([]);
            const dateQuery = start && end
                ? `?from_datetime=${moment(start).utc().format()}&to_datetime=${moment(end).utc().format()}`
                : '';

            fetch(`/v1/incidents${dateQuery}`)
                .then(checkResponse)
                .then((data) => {
                    if (data?.error) {
                        throw new Error('Error occurred when fetching incidents');
                    }
                    const uniqueTickets = getUniqueByProperty(data, 'id');
                    const adjustedUniqueTickets = adjustTicketProperties(uniqueTickets)
                        .map((incident) => {
                            incident.time = moment.utc(incident.start_date).local().isValid() ? moment.utc(incident.start_date).valueOf() : '-';
                            incident.category = INCIDENT_ANNOTATION_CATEGORY;
                            return incident;
                        });
                    const incidentPriority = getListOfUniqueProperties(adjustedUniqueTickets, 'priority');
                    const incidentStatus = getListOfUniqueProperties(adjustedUniqueTickets, 'status');
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
                    console.error(err);
                })
                .finally(() => setIsIncidentsAnnotationsLoading(false));
        };

        const fetchAbTestsAnnotations = () => {
            setIsAbTestsAnnotationsLoading(true);
            setAbTestsAnnotations([]);
            const dateQuery = start && end
                ? `?from_datetime=${moment(start).utc().format()}&to_datetime=${moment(end).utc().format()}`
                : '';

            fetch(`/abTests${dateQuery}`)
                .then(checkResponse)
                .then((data) => {
                    if (data?.error) {
                        throw new Error('Error occurred when fetching abTests');
                    }
                    const adjustedAbTests = data.map((abTest) => ({
                        ...abTest,
                        status: abTest.ab_test_details?.status,
                        time: moment.utc(abTest.opened_at).local().isValid() ? moment.utc(abTest.opened_at).valueOf() : '-',
                        category: AB_TESTS_ANNOTATION_CATEGORY
                    }));

                    setAbTestsAnnotations(adjustedAbTests);
                    const abTestsStatus = getListOfUniqueProperties(adjustedAbTests.map((item) => item.ab_test_details), 'status');
                    setAbTestsStatusSuggestions(abTestsStatus);
                    setSuggestions((prevSuggestions) => ({
                        ...prevSuggestions,
                        abTestsStatus
                    }));
                })
                .catch((err) => {
                    setAbTestsAnnotationsError(true);
                    console.error(err);
                })
                .finally(() => setIsAbTestsAnnotationsLoading(false));
        };

        fetchIncidentsAnnotations();
        fetchDeploymentAnnotations();
        fetchAbTestsAnnotations();
    }, [start, end]);

    useEffect(() => {
        const allAnnotations = [...deploymentAnnotations, ...incidentAnnotations];
        filterCategories(allAnnotations);
        filterSuggestions();
    }, [deploymentAnnotations, incidentAnnotations]);

    useEffect(() => {
        setEnableAnnotations(deploymentCategory || incidentCategory || abTestsCategory);
    }, [deploymentCategory, incidentCategory, abTestsCategory, setEnableAnnotations]);

    const onFilterChange = (value) => {
        const adjustedInputValue = adjustInputValue(value);

        setSelectedProducts(filterNewSelectedItems(adjustedInputValue, 'product_name'));
        setSelectedApplications(filterNewSelectedItems(adjustedInputValue, 'application_name'));
        setSelectedServiceTiers(filterNewSelectedItems(adjustedInputValue, 'service_tier'));
        setSelectedStatuses(filterNewSelectedItems(adjustedInputValue, 'incident_status'));
        setSelectedPriorities(filterNewSelectedItems(adjustedInputValue, 'incident_priority'));
        setSelectedAbTestsStatuses(filterNewSelectedItems(adjustedInputValue, 'abTestsStatus'));
    };

    useEffect(() => {
        const products = !productMapping || productMapping.error ? [] : productMapping;
        const adjustedProducts = products.map(({product_name: productName}) => productName);

        const adjustedApplications = products.reduce((acc, current) => {
            return [...acc, ...current.application_names];
        }, []);
        const serviceTier = ['Tier 1', 'Tier 2', 'Tier 3'];

        setProductNameSuggestions(adjustedProducts);
        setApplicationNameSuggestions(adjustedApplications);
        setServiceTierSuggestions(serviceTier);

        setSuggestions((prevSuggestions) => ({
            ...prevSuggestions,
            product_name: adjustedProducts,
            application_name: adjustedApplications,
            service_tier: serviceTier
        }));
    }, [productMapping]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });

    useEffect(() => {
        const annotationError = `An unexpected error has occurred loading the annotations. Try refreshing the page. If this problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`;
        if (deploymentAnnotationsError && incidentAnnotationsError && abTestsAnnotationsError) {
            setDisplayError(annotationError);
        }
    }, [deploymentAnnotationsError, incidentAnnotationsError, abTestsAnnotationsError]);

    return (
        <div className={`annotations-container advanced-filter-${openAdvancedFilter ? 'active' : 'inactive'}`}>
            <button
                onClick={() => setOpenAdvancedFilter(!openAdvancedFilter)}
                className="btn btn-default display-annotations-btn"
                type="button"
            >
                <SVGIcon usefill markup={FILTER__16} />{'Display Annotations'}
            </button>
            <div className="annotations-wrapper" ref={ref}>
                <LoadingContainer
                    isLoading={isDeploymentsAnnotationsLoading || isIncidentsAnnotationsLoading || isAbTestsAnnotationsLoading}
                    error={displayError}
                    className="annotations-filters-container"
                >
                    <div className="annotations-category-filters">
                        <h4>{'Annotations:'}</h4>
                        <Checkbox
                            name="deployment-сheckbox"
                            label="Deployments"
                            checked={deploymentCategory}
                            onChange={() => setDeploymentCategory(!deploymentCategory)}
                            size="sm"
                            disabled={deploymentAnnotationsError}
                        />
                        <Checkbox
                            name="incident-сheckbox"
                            label="Incidents"
                            checked={incidentCategory}
                            onChange={() => setIncidentCategory(!incidentCategory)}
                            size="sm"
                            disabled={incidentAnnotationsError}
                        />
                        <Checkbox
                            name="incident-сheckbox"
                            label="A/B tests"
                            checked={abTestsCategory}
                            onChange={() => setAbTestsCategory(!abTestsCategory)}
                            size="sm"
                            disabled={abTestsAnnotationsError}
                        />
                    </div>
                    {typeof onFilterChange === 'function' &&
                        <UniversalSearch
                            suggestions={suggestions}
                            suggestionMapping={productMapping}
                            onFilterChange={onFilterChange}
                            defaultSelection={[{key: 'service_tier', value: 'Tier 1'}]}
                            resetSelection={false}
                        />
                    }
                </LoadingContainer>
            </div>
        </div>
    );
};

export default Annotations;
