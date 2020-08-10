/* eslint-disable no-use-before-define */
import React, {useState, useEffect, useCallback} from 'react';
import moment from 'moment';
import 'moment-timezone';
import {Navigation} from '@homeaway/react-navigation';
import LoadingContainer from '../../../components/LoadingContainer';
import FilterDropDown from '../../../components/FilterDropDown';
import DatePicker from '../../../components/DatePicker/index';
import {
    DATE_FORMAT,
    ALL_STATUSES_OPTION,
    ALL_PRIORITIES_OPTION,
    ALL_TAGS_OPTION,
    ALL_RC_OWNERS_OPTION
} from '../../../constants';
import {Incidents, Overview, Top5, FinancialImpact} from './tabs/index';
import {useFetchTickets} from '../hooks';
import {EG_BRAND} from '../../../constants';
import {useSelectedBrand, useQueryParamChange} from '../../hooks';
import './styles.less';
import {SVGIcon} from '@homeaway/react-svg';
import {FILTER__16} from '@homeaway/svg-defs';
import {Divider} from '@homeaway/react-collapse';

const statusDefaultValue = ALL_STATUSES_OPTION;
const priorityDefaultValue = ALL_PRIORITIES_OPTION;
const tagDefaultValue = ALL_TAGS_OPTION;
const rcOwnerDefaultValue = ALL_RC_OWNERS_OPTION;
const startDateDefaultValue = moment().subtract(90, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();
const navLinks = [
    {
        id: 'overview',
        label: 'Overview',
        href: '/incident-trends'
    },
    {
        id: 'incidents',
        label: 'Incidents',
        href: '/incident-trends'
    },
    {
        id: 'top5',
        label: 'Top 5',
        href: '/incident-trends'
    },
    {
        id: 'financialImpact',
        label: 'Financial Impact',
        href: '/incident-trends'
    },
];


const IncidentTrendsDashboard = (props) => {
    const selectedBrand = props.selectedBrands[0];

    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState(statusDefaultValue);
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [appliedStartDate, setAppliedStartDate] = useState(startDate);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [appliedEndDate, setAppliedEndDate] = useState(endDate);
    const [selectedPriority, setSelectedPriority] = useState(priorityDefaultValue);
    const [selectedTag, setSelectedTag] = useState(tagDefaultValue);
    const [selectedRcOwner, setSelectedRcOwner] = useState(rcOwnerDefaultValue);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    // incidents
    const [filteredUniqueIncidents, setFilteredUniqueIncidents] = useState([]);
    const [filteredAllIncidents, setFilteredAllIncidents] = useState([]);

    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [
        isLoading,
        error,
        allUniqueIncidents,
        allIncidents,
        incidentsPriorities,
        incidentsStatuses,
        incidentsTags,
        rootCauseOwners
    ] = useFetchTickets(
        isApplyClicked,
        startDate,
        endDate,
        applyFilters,
        setIsApplyClicked,
        'incidents'
    );
    useQueryParamChange(selectedBrand, props.onBrandChange);
    useSelectedBrand(selectedBrand, props.onBrandChange, props.prevSelectedBrand);

    function applyFilters() {
        const matchesPriority = (t) => selectedPriority === priorityDefaultValue || t.priority === selectedPriority;
        const matchesBrand = (t) => selectedBrand === EG_BRAND || selectedBrand === t.Brand;
        const matchesStatus = (t) => selectedStatus === statusDefaultValue || t.status === selectedStatus;
        const matchesTag = (t) => selectedTag === tagDefaultValue || t.tag === selectedTag || (Array.isArray(t.tag) && t.tag.includes(selectedTag));
        const matchesRcOwner = (t) => selectedRcOwner === rcOwnerDefaultValue || t['RC Owner'] === selectedRcOwner;
        const filterTickets = (t) => matchesPriority(t) && matchesBrand(t) && matchesStatus(t) && matchesTag(t) && matchesRcOwner(t);

        setFilteredUniqueIncidents([...allUniqueIncidents].filter(filterTickets));
        setFilteredAllIncidents([...allIncidents].filter(filterTickets));

        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
        setIsDirtyForm(false);
    }

    useEffect(() => {
        applyFilters();
    }, [allUniqueIncidents, allIncidents]);

    const handleNavigationClick = (e, activeLinkIndex) => {
        setActiveIndex(activeLinkIndex);
    };

    const handleDateRangeChange = (start, end) => {
        setStartDate(start || startDate);
        setEndDate(end || endDate);
        setIsDirtyForm(true);
    };

    const handleClearDates = () => {
        setStartDate('');
        setEndDate('');
        setFilteredUniqueIncidents([]);
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

    const handleTagChange = useCallback((tag) => {
        setSelectedTag(tag);
        setIsDirtyForm(true);
    }, []);

    const handleRcOwnerChange = useCallback((owner) => {
        setSelectedRcOwner(owner);
        setIsDirtyForm(true);
    });

    const handleShowMoreFilters = () => {
        setShowMoreFilters(!showMoreFilters);
    };

    // eslint-disable-next-line complexity
    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return <Overview startDate={appliedStartDate} endDate={appliedEndDate} filteredIncidents={filteredUniqueIncidents} />;
            case 1:
                return <Incidents filteredIncidents={filteredUniqueIncidents} />;
            case 2:
                return <Top5 filteredIncidents={filteredUniqueIncidents} />;
            case 3:
                return <FinancialImpact filteredIncidents={filteredAllIncidents} />;
            default:
                return <Incidents filteredIncidents={filteredUniqueIncidents} />;
        }
    };

    const renderMoreFilters = () => (
        <Divider heading="More Filters" id="more-filters-divider" className="more-filters-divider" expanded={showMoreFilters}>
            <form className="search-form search-form__more">
                <FilterDropDown
                    id="rc-owner-dropdown"
                    className="filter-dropdown rc-owner-dropdown"
                    list={rootCauseOwners}
                    selectedValue={selectedRcOwner}
                    onClickHandler={handleRcOwnerChange}
                />
            </form>
        </Divider>
    );

    return (
        <div className="incident-trends-container">
            <h1 className="page-title">{'Incident Trends'}</h1>
            <div className="filters-wrapper">
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    handleDateRangeChange={handleDateRangeChange}
                    handleClearDates={handleClearDates}
                />
                <FilterDropDown
                    id="priority-dropdown"
                    className="priority-dropdown"
                    list={incidentsPriorities}
                    selectedValue={selectedPriority}
                    onClickHandler={handlePriorityChange}
                />
                <FilterDropDown
                    id="status-dropdown"
                    className="status-dropdown"
                    list={incidentsStatuses}
                    selectedValue={selectedStatus}
                    onClickHandler={handleStatusChange}
                />
                <FilterDropDown
                    id="tag-dropdown"
                    className="tag-dropdown"
                    list={incidentsTags}
                    selectedValue={selectedTag}
                    onClickHandler={handleTagChange}
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
                    className={`btn btn-default more-filters-btn ${showMoreFilters ? 'active' : ''}`}
                    onClick={handleShowMoreFilters}
                >
                    <SVGIcon usefill markup={FILTER__16} />{' More Filters'}
                </button>
            </div>
            {renderMoreFilters()}
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={navLinks}
                onLinkClick={handleNavigationClick}
            />
            <LoadingContainer isLoading={isLoading} error={error} className="incident-main">
                {renderTabs()}
            </LoadingContainer>
        </div>
    );
};

export default IncidentTrendsDashboard;
