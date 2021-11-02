import React, {useState, useEffect, useCallback} from 'react';
import {useHistory, useLocation, withRouter} from 'react-router-dom';
import moment from 'moment';
import Select from 'react-select';
import {Navigation} from '@homeaway/react-navigation';
import {SVGIcon} from '@homeaway/react-svg';
import {FILTER__16} from '@homeaway/svg-defs';
import {Divider} from '@homeaway/react-collapse';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import HelpText from '../../components/HelpText/HelpText';
import Overview from './tabs/Overview';
import Tickets from './tabs/Tickets';
import CorrectiveActions from './tabs/CorrectiveActions';
import {
    ALL_STATUSES_OPTION,
    ALL_PRIORITIES_OPTION,
    ALL_TYPES_OPTION,
    ALL_ORGS_OPTION,
    ALL_RC_OWNERS_OPTION,
    ALL_RC_CATEGORIES_OPTION, DATE_FORMAT
} from '../../constants';
import {useFetchTickets} from './hooks';
import {useQueryParamChange, useSelectedBrand} from '../hooks';
import {NAV_LINKS, CA_STATUS_LIST} from './constants';
import {getQueryValues, generateUrl, getActiveIndex, filterType} from './utils';
import {validDateRange} from '../utils';
import './styles.less';


// eslint-disable-next-line complexity
const PRB = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const history = useHistory();
    const {pathname, search} = useLocation();
    const [activeIndex, setActiveIndex] = useState(getActiveIndex(pathname));
    const [showMoreFilters, setShowMoreFilters] = useState(false);

    const {
        initialStart,
        initialEnd,
        initialType,
        initialStatus,
        initialPriority,
        initialOrg,
        initialRcOwner,
        initialRcCategory,
        initialCAStatuses,
        initialCAOrgs
    } = getQueryValues(search);

    const [startDate, setStartDate] = useState(initialStart);
    const [endDate, setEndDate] = useState(initialEnd);
    const [selectedType, setSelectedType] = useState(initialType);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [selectedPriority, setSelectedPriority] = useState(initialPriority);
    const [selectedOrg, setSelectedOrg] = useState(initialOrg);
    const [selectedRcOwner, setSelectedRcOwner] = useState(initialRcOwner);
    const [selectedRcCategory, setSelectedRcCategory] = useState(initialRcCategory);
    const [selectedCAStatuses, setSelectedCAStatuses] = useState(initialCAStatuses);
    const [selectedL1, setSelectedL1] = useState(null);
    const [selectedL2, setSelectedL2] = useState(null);
    const [selectedL3, setSelectedL3] = useState(null);
    const [selectedL4, setSelectedL4] = useState(null);
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [currentPriorities, setCurrentPriorities] = useState([]);
    const [currentStatuses, setCurrentStatuses] = useState([]);
    const [currentTypes, setCurrentTypes] = useState(['Corrective Action', 'Epic', 'Incident', 'Post Mortem', 'Resiliency Validation']);
    const [currentOrgs, setCurrentOrgs] = useState([]);
    const [currentRcOwners, setCurrentRcOwners] = useState([]);
    const [currentRcCategories, setCurrentRcCategories] = useState([]);

    const [filteredTickets, setFilteredTickets] = useState([]);

    const [
        isLoading,
        error,
        allTickets
    ] = useFetchTickets(
        isApplyClicked,
        startDate,
        endDate,
        // eslint-disable-next-line no-use-before-define
        applyFilters,
        setIsApplyClicked,
        setCurrentPriorities,
        setCurrentStatuses,
        setCurrentTypes,
        setCurrentOrgs,
        setCurrentRcOwners,
        setCurrentRcCategories
    );
    useQueryParamChange(onBrandChange);
    useSelectedBrand(selectedBrands[0], prevSelectedBrand);

    // Filters
    const matchesPriority = (t) => selectedPriority === ALL_PRIORITIES_OPTION || t.Priority === selectedPriority;
    const matchesStatus = (t) => selectedStatus === ALL_STATUSES_OPTION || t.Status === selectedStatus;
    const matchesOrg = (t) => selectedOrg === ALL_ORGS_OPTION || t['Owning Org'] === selectedOrg;
    const matchesRcOwner = (t) => selectedRcOwner === ALL_RC_OWNERS_OPTION || t['RC Owner'] === selectedRcOwner;
    const matchesRcCategory = (t) => selectedRcCategory === ALL_RC_CATEGORIES_OPTION || t['RC Category'] === selectedRcCategory;

    // eslint-disable-next-line complexity
    const filterTickets = (t) => (
        matchesPriority(t)
        && matchesStatus(t)
        && matchesOrg(t)
        && matchesRcOwner(t)
        && matchesRcCategory(t)
    );

    const getInitialCAOrg = (selected, l) => (selected || {name: initialCAOrgs[l]});

    const updateHistory = () => history.push(generateUrl(
        activeIndex,
        selectedBrands,
        startDate,
        endDate,
        selectedType,
        selectedStatus,
        selectedPriority,
        selectedOrg,
        selectedRcOwner,
        selectedRcCategory,
        selectedCAStatuses,
        getInitialCAOrg(selectedL1, 'l1'),
        getInitialCAOrg(selectedL2, 'l2'),
        getInitialCAOrg(selectedL3, 'l3'),
        getInitialCAOrg(selectedL4, 'l4')
    ));

    function applyFilters() {
        if (!validDateRange(startDate, endDate)) {
            const values = getQueryValues(search);
            setStartDate(values.initialStart);
            setEndDate(values.initialEnd);
        }
        const result = filterType(allTickets, selectedType).filter(filterTickets);
        setFilteredTickets(result);
        updateHistory();
        setIsDirtyForm(false);
    }

    useEffect(() => {
        applyFilters();
    }, [allTickets]);

    useEffect(() => {
        updateHistory();
    }, [selectedL1, selectedL2, selectedL3, selectedL4, activeIndex]);

    const handleDateRangeChange = ({start, end}) => {
        setStartDate(moment(start).format(DATE_FORMAT));

        if (!!end || (!end && moment(start).isAfter(endDate))) {
            setEndDate(moment(end).format(DATE_FORMAT));
        }

        setIsDirtyForm(true);
    };

    const handlePriorityChange = useCallback((priority) => {
        setSelectedPriority(priority);
        setIsDirtyForm(true);
    }, []);

    const handleStatusChange = useCallback((status) => {
        setSelectedStatus(status);
        setIsDirtyForm(true);
    }, []);

    const handleTypeChange = (type) => {
        setSelectedType(type);
        setIsDirtyForm(true);
    };

    const handleOrgChange = (org) => {
        setSelectedOrg(org);
        setIsDirtyForm(true);
    };

    const handleRcOwnerChange = (owner) => {
        setSelectedRcOwner(owner);
        setIsDirtyForm(true);
    };

    const handleRcCategoryChange = (owner) => {
        setSelectedRcCategory(owner);
        setIsDirtyForm(true);
    };

    const handleCAStatusChange = (status) => {
        setSelectedCAStatuses(status || []);
        setIsDirtyForm(true);
    };

    const handleNavigationClick = (e, activeLinkIndex) => {
        setActiveIndex(activeLinkIndex);
    };

    const handleShowMoreFilters = () => {
        setShowMoreFilters(!showMoreFilters);
    };

    const generateChartClickHandler = (handler) => (e) => {
        const chartName = e.data.name;
        handler(chartName);
        setIsApplyClicked(true);
    };

    const handleL1Change = (l1) => {
        setSelectedL1(l1);
    };

    const handleL2Change = (l2) => {
        setSelectedL2(l2);
    };

    const handleL3Change = (l3) => {
        setSelectedL3(l3);
    };

    const handleL4Change = (l4) => {
        setSelectedL4(l4);
    };

    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return (
                    <Overview
                        tickets={filteredTickets}
                        generateChartClickHandler={generateChartClickHandler}
                        onOrgChange={handleOrgChange}
                        onStatusChange={handleStatusChange}
                        onPriorityChange={handlePriorityChange}
                    />);
            case 1:
                return <Tickets tickets={filteredTickets} />;
            case 2:
                return (
                    <CorrectiveActions
                        start={startDate}
                        end={endDate}
                        statuses={selectedCAStatuses}
                        initialL1={initialCAOrgs.l1}
                        initialL2={initialCAOrgs.l2}
                        initialL3={initialCAOrgs.l3}
                        initialL4={initialCAOrgs.l4}
                        onL1Change={handleL1Change}
                        onL2Change={handleL2Change}
                        onL3Change={handleL3Change}
                        onL4Change={handleL4Change}
                        selectedL1={selectedL1}
                        selectedL2={selectedL2}
                        selectedL3={selectedL3}
                        selectedL4={selectedL4}
                        isApplyClicked={isApplyClicked}
                    />
                );
            default:
                return <Tickets tickets={filteredTickets} />;
        }
    };

    const renderFilters = () => {
        const hideForCA = activeIndex === 2 ? 'hidden' : '';
        const showForCA = activeIndex !== 2 ? 'hidden' : '';
        return (
            <div className="filters-wrapper">
                <DatetimeRangePicker
                    onChange={handleDateRangeChange}
                    startDate={moment(startDate).toDate()}
                    endDate={moment(endDate).toDate()}
                    hidePresets
                />
                <Select
                    isMulti
                    classNamePrefix="status-select"
                    className={`status-select-container ${showForCA}`}
                    value={selectedCAStatuses}
                    options={CA_STATUS_LIST}
                    onChange={handleCAStatusChange}
                    placeholder={'Select Status'}
                />
                <FilterDropDown
                    id="org-dropdown"
                    className={`filter-dropdown org-dropdown ${hideForCA}`}
                    list={[ALL_ORGS_OPTION, ...currentOrgs]}
                    selectedValue={selectedOrg}
                    onClickHandler={handleOrgChange}
                />
                <FilterDropDown
                    id="priority-dropdown"
                    className={`filter-dropdown priority-dropdown ${hideForCA}`}
                    list={[ALL_PRIORITIES_OPTION, ...currentPriorities]}
                    selectedValue={selectedPriority}
                    onClickHandler={handlePriorityChange}
                />
                <FilterDropDown
                    id="type-dropdown"
                    className={`filter-dropdown type-dropdown ${hideForCA}`}
                    list={[ALL_TYPES_OPTION, ...currentTypes]}
                    selectedValue={selectedType}
                    onClickHandler={handleTypeChange}
                />
                <button
                    type="button"
                    className="apply-button btn btn-primary active"
                    onClick={() => {
                        setIsApplyClicked(true);
                    }}
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
                <button
                    type="button"
                    className={`btn btn-default more-filters-btn ${showMoreFilters ? 'active' : ''} ${hideForCA}`}
                    onClick={handleShowMoreFilters}
                >
                    <SVGIcon usefill markup={FILTER__16} />{' More Filters'}
                </button>
            </div>
        );
    };

    const renderMoreFilters = () => (
        <Divider heading="More Filters" id="more-filters-divider" className={`more-filters-divider ${activeIndex === 2 ? 'hidden' : ''}`} expanded={showMoreFilters}>
            <form className="search-form search-form__more">
                <FilterDropDown
                    id="status-dropdown"
                    className="filter-dropdown status-dropdown"
                    list={[ALL_STATUSES_OPTION, ...currentStatuses]}
                    selectedValue={selectedStatus}
                    onClickHandler={handleStatusChange}
                />
                <FilterDropDown
                    id="rc-owner-dropdown"
                    className="filter-dropdown rc-owner-dropdown"
                    list={[ALL_RC_OWNERS_OPTION, ...currentRcOwners]}
                    selectedValue={selectedRcOwner}
                    onClickHandler={handleRcOwnerChange}
                />
                <FilterDropDown
                    id="rcCategory-dropdown"
                    className="filter-dropdown rcCategory-dropdown"
                    list={[ALL_RC_CATEGORIES_OPTION, ...currentRcCategories]}
                    selectedValue={selectedRcCategory}
                    onClickHandler={handleRcCategoryChange}
                />
            </form>
        </Divider>
    );

    return (
        <div className="pm-container">
            <h1 className="page-title">
                {'Problem Management'}
                <HelpText className="page-info" text="PRB tickets are designed to track root cause analysis and remediation of incidents." />
            </h1>
            {renderFilters()}
            {renderMoreFilters()}
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={NAV_LINKS}
                onLinkClick={handleNavigationClick}
            />
            <LoadingContainer isLoading={isLoading} error={error}>
                {renderTabs()}
            </LoadingContainer>
        </div>
    );
};

export default withRouter(PRB);
