/* eslint-disable no-use-before-define */
import React, {useState, useEffect, useCallback} from 'react';
import {useHistory, useLocation} from 'react-router';
import qs from 'query-string';
import moment from 'moment';
import 'moment-timezone';
import {Navigation} from '@homeaway/react-navigation';
import {SVGIcon} from '@homeaway/react-svg';
import {FILTER__16} from '@homeaway/svg-defs';
import {Divider} from '@homeaway/react-collapse';
import PieChart from '../../components/PieChart/index';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import DatePicker from '../../components/DatePicker';
import DataTable from '../../components/DataTable';
import HelpText from '../../components/HelpText/HelpText';
import {
    DATE_FORMAT, BRANDS, ALL_STATUSES_OPTION,
    ALL_PRIORITIES_OPTION, ALL_BRANDS_OPTION,
    ALL_TYPES_OPTION, ALL_ORGS_OPTION,
    ALL_RC_OWNERS_OPTION, ALL_RC_CATEGORIES_OPTION
} from '../constants';
import {getPieData} from '../utils';
import {useFetchTickets} from './hooks';
import './styles.less';

const statusDefaultValue = ALL_STATUSES_OPTION;
const brandDefaultValue = ALL_BRANDS_OPTION;
const typeDefaultValue = ALL_TYPES_OPTION;
const priorityDefaultValue = ALL_PRIORITIES_OPTION;
const orgDefaultValue = ALL_ORGS_OPTION;
const rcOwnerDefaultValue = ALL_RC_OWNERS_OPTION;
const rcCategoryDefaultValue = ALL_RC_CATEGORIES_OPTION;
const startDateDefaultValue = moment().subtract(90, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();
const navLinks = [
    {
        id: 'overview',
        label: 'Overview',
        href: '/prb'
    },
    {
        id: 'Tickets',
        label: 'Tickets',
        href: '/prb'
    }
];

const getActiveIndex = (pathname, history) => {
    if (pathname.includes('prb/overview')) {
        return 0;
    }
    if (pathname.includes('prb/tickets')) {
        return 1;
    }
    history.push('/prb/overview');
    return 0;
};

// eslint-disable-next-line complexity
const PRB = () => {
    const history = useHistory();
    const {pathname, search} = useLocation();
    const query = qs.parse(search); // query params from url

    const [activeIndex, setActiveIndex] = useState(getActiveIndex(pathname, history));
    const [showMoreFilters, setShowMoreFilters] = useState(false);

    const [startDate, setStartDate] = useState(query.start || startDateDefaultValue);
    const [endDate, setEndDate] = useState(query.end || endDateDefaultValue);
    const [selectedType, setSelectedType] = useState(query.type || typeDefaultValue);
    const [selectedStatus, setSelectedStatus] = useState(query.status || statusDefaultValue);
    const [selectedBrand, setSelectedBrand] = useState(query.brand || brandDefaultValue);
    const [selectedPriority, setSelectedPriority] = useState(query.priority || priorityDefaultValue);
    const [selectedOrg, setSelectedOrg] = useState(query.org || orgDefaultValue);
    const [selectedRcOwner, setSelectedRcOwner] = useState(query.rcowner || rcOwnerDefaultValue);
    const [selectedRcCategory, setSelectedRcCategory] = useState(query.rccategory || rcCategoryDefaultValue);
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [currentPriorities, setCurrentPriorities] = useState(['0-Code Red', '1-Critical', '2-High', '3-Medium', '4-Low']);
    const [currentStatuses, setCurrentStatuses] = useState(['To Do', 'In Progress', 'Done', 'Resolved', 'Testing', 'Closed']);
    const [currentTypes, setCurrentTypes] = useState(['Corrective Action', 'Incident', 'Post Mortum', 'Resiliency Validation']);
    const [currentOrgs, setCurrentOrgs] = useState(['Egencia', 'Platform & Marketplaces']);
    const [currentRcOwners, setCurrentRcOwners] = useState(['EWE - Air Development', 'Egencia - Hotel Shopping']);
    const [currentRcCategories, setCurrentRcCategories] = useState(['Architectural']);

    const [filteredTickets, setFilteredTickets] = useState([]);

    const [
        isLoading,
        error,
        allTickets
    ] = useFetchTickets(
        isApplyClicked,
        startDate,
        endDate,
        applyFilters,
        setIsApplyClicked,
        setCurrentPriorities,
        setCurrentStatuses,
        setCurrentTypes,
        setCurrentOrgs,
        setCurrentRcOwners,
        setCurrentRcCategories
    );

    function renderDetail(label, value) {
        return (
            <>
                <div className="details-label">{label}</div>
                <div className="details-value">{value || '-'}</div>
            </>
        );
    }

    function filterType(tickets) {
        let result = [];
        const matchesType = (i) => selectedType === typeDefaultValue || !i['Issue Type'].localeCompare(selectedType);
        tickets.forEach((t) => {
            const filteredT = t;
            const linkedIssues = filteredT.linkedIssues || [];
            const filteredLinkedIssues = linkedIssues.filter(matchesType);
            if (filteredLinkedIssues.length > 0) {
                filteredT['Linked Issues'] = (
                    <>
                        <h3>{'Details'}</h3>
                        <div className="details-container">
                            {renderDetail('Brands Affected:', (filteredT.brandsAffected || []).join(', '))}
                            {renderDetail('Lines of Business Impacted:', filteredT.linesOfBusinessImpacted)}
                        </div>
                        <h3>
                            {'Linked Issues'}
                            <HelpText className="page-info" text="Each PRB has a number of follow-up items and other correlations that are tracked through other Jira ticket types" />
                        </h3>
                        <DataTable
                            className="linked-issues__table"
                            data={filteredLinkedIssues}
                            columns={['Ticket', 'Summary', 'Issue Type', 'Status', 'Assignee']}
                            expandableColumns={['Linked Issues']}
                        />
                    </>
                );
                result.push(filteredT);
            } else if (selectedType === typeDefaultValue) {
                result.push(filteredT);
            }
        });
        return result;
    }

    // Filters
    const matchesPriority = (t) => selectedPriority === priorityDefaultValue || t.Priority === selectedPriority;
    const matchesBrand = (t) => selectedBrand === brandDefaultValue || t.Brand === selectedBrand;
    const matchesStatus = (t) => selectedStatus === statusDefaultValue || t.Status === selectedStatus;
    const matchesOrg = (t) => selectedOrg === orgDefaultValue || t['Owning Org'] === selectedOrg;
    const matchesRcOwner = (t) => selectedRcOwner === rcOwnerDefaultValue || t['RC Owner'] === selectedRcOwner;
    const matchesRcCategory = (t) => selectedRcCategory === rcCategoryDefaultValue || t['RC Category'] === selectedRcCategory;
    // eslint-disable-next-line complexity
    const filterTickets = (t) => (
        matchesPriority(t)
        && matchesBrand(t)
        && matchesStatus(t)
        && matchesOrg(t)
        && matchesRcOwner(t)
        && matchesRcCategory(t)
    );

    function getUrlParm(label, value, defaultValue) {
        return value && value !== defaultValue
            ? `&${label}=${value}`
            : '';
    }

    function applyFilters() {
        const result = filterType(allTickets).filter(filterTickets);
        setFilteredTickets(result);
        history.push(`${pathname}`
            + `?start=${startDate}`
            + `&end=${endDate}`
            + `${getUrlParm('type', selectedType, typeDefaultValue)}`
            + `${getUrlParm('status', selectedStatus, statusDefaultValue)}`
            + `${getUrlParm('brand', selectedBrand, brandDefaultValue)}`
            + `${getUrlParm('priority', selectedPriority, priorityDefaultValue)}`
            + `${getUrlParm('org', selectedOrg, orgDefaultValue)}`
            + `${getUrlParm('rcowner', selectedRcOwner, rcOwnerDefaultValue)}`
            + `${getUrlParm('rccategory', selectedRcCategory, rcCategoryDefaultValue)}`
        );
        setIsDirtyForm(false);
    }

    useEffect(() => {
        applyFilters();
    }, [allTickets]);

    const handleDateRangeChange = (start, end) => {
        setStartDate(start || startDate);
        setEndDate(end || endDate);
        setIsDirtyForm(true);
    };

    const handleClearDates = () => {
        setStartDate('');
        setEndDate('');
        setIsDirtyForm(true);
    };

    const handlePriorityChange = useCallback((priority) => {
        setSelectedPriority(priority);
        setIsDirtyForm(true);
    }, []);

    const handleBrandChange = useCallback((brand) => {
        setSelectedBrand(brand);
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

    const renderOverview = () => (
        <div className="overview-charts">
            <PieChart
                data={getPieData(filteredTickets, 'Brand')}
                title="Brand"
                onChartClick={generateChartClickHandler(handleBrandChange)}
            />
            <PieChart
                data={getPieData(filteredTickets, 'Status')}
                title="Status"
                onChartClick={generateChartClickHandler(handleStatusChange)}
            />
            <PieChart
                data={getPieData(filteredTickets, 'Priority')}
                title="Priority"
                handlePriorityChange={handlePriorityChange}
                onChartClick={generateChartClickHandler(handlePriorityChange)}
            />
        </div>
    );

    // eslint-disable-next-line complexity
    const renderTable = () => (
        <DataTable
            title={`Tickets (${filteredTickets.length} ${filteredTickets.length === 1 ? 'result' : 'results'})`}
            data={filteredTickets || []}
            columns={['Ticket', 'Priority', 'Brand', 'Opened', 'Summary', 'Owning Org', 'RC Owner', 'RC Category', 'Status']}
            expandableColumns={['Linked Issues']}
            columnsInfo={{
                Ticket: (
                    <div>
                        <b>{'Ticket'}</b><br />
                        {'Main Epic Jira ticket for a PRB follow-up ticket'}
                    </div>
                )
            }}
        />
    );

    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return renderOverview();
            case 1:
                return renderTable();
            default:
                return renderTable();
        }
    };

    const renderFilters = () => (
        <div id="filters-wrapper">
            <DatePicker
                startDate={startDate}
                endDate={endDate}
                minDate={minDate}
                handleDateRangeChange={handleDateRangeChange}
                handleClearDates={handleClearDates}
            />
            <FilterDropDown
                id="priority-dropdown"
                className="filter-dropdown"
                list={[priorityDefaultValue, ...currentPriorities]}
                selectedValue={selectedPriority}
                onClickHandler={handlePriorityChange}
            />
            <FilterDropDown
                id="brand-dropdown"
                className="filter-dropdown"
                list={BRANDS}
                selectedValue={selectedBrand}
                onClickHandler={handleBrandChange}
            />
            <FilterDropDown
                id="type-dropdown"
                className="filter-dropdown"
                list={[typeDefaultValue, ...currentTypes]}
                selectedValue={selectedType}
                onClickHandler={handleTypeChange}
            />
            <button
                id="applyButton"
                type="button"
                className="btn btn-primary active"
                onClick={() => {
                    setIsApplyClicked(true);
                }}
                disabled={!isDirtyForm}
            >
                {'Apply'}
            </button>
            <button
                type="button"
                className={`btn btn-default more-filters-btn ${showMoreFilters ? 'active' : ''}`}
                onClick={handleShowMoreFilters}
            >
                <SVGIcon usefill markup={FILTER__16} />{' More Filters'}
            </button>
        </div>
    );

    const renderMoreFilters = () => (
        <Divider heading="More Filters" id="more-filters-divider" className="more-filters-divider" expanded={showMoreFilters}>
            <form className="search-form search-form__more">
                <FilterDropDown
                    id="status-dropdown"
                    className="filter-dropdown"
                    list={[statusDefaultValue, ...currentStatuses]}
                    selectedValue={selectedStatus}
                    onClickHandler={handleStatusChange}
                />
                <FilterDropDown
                    id="org-dropdown"
                    className="filter-dropdown"
                    list={[orgDefaultValue, ...currentOrgs]}
                    selectedValue={selectedOrg}
                    onClickHandler={handleOrgChange}
                />
                <FilterDropDown
                    id="rcOwner-dropdown"
                    className="filter-dropdown"
                    list={[rcOwnerDefaultValue, ...currentRcOwners]}
                    selectedValue={selectedRcOwner}
                    onClickHandler={handleRcOwnerChange}
                />
                <FilterDropDown
                    id="rcCategory-dropdown"
                    className="filter-dropdown"
                    list={[rcCategoryDefaultValue, ...currentRcCategories]}
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
                links={navLinks}
                onLinkClick={handleNavigationClick}
            />
            <LoadingContainer isLoading={isLoading} error={error} className="pm-table">
                {renderTabs()}
            </LoadingContainer>
        </div>
    );
};

export default PRB;