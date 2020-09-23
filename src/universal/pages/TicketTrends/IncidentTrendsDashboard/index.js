/* eslint-disable no-use-before-define */
import React, {useState, useEffect, useCallback} from 'react';
import moment from 'moment';
import 'moment-timezone';
import {Divider} from '@homeaway/react-collapse';
import {Checkbox} from '@homeaway/react-form-components';
import {Navigation} from '@homeaway/react-navigation';
import {SVGIcon} from '@homeaway/react-svg';
import {FILTER__16} from '@homeaway/svg-defs';
import DatePicker from '../../../components/DatePicker/index';
import FilterDropDown from '../../../components/FilterDropDown';
import LoadingContainer from '../../../components/LoadingContainer';
import {
    DATE_FORMAT,
    ALL_STATUSES_OPTION,
    ALL_PRIORITIES_OPTION,
    ALL_TAGS_OPTION,
    ALL_RC_OWNERS_OPTION,
    ALL_PARTNERS_OPTION,
    EG_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND
} from '../../../constants';
import {Incidents, Overview, Top5, FinancialImpact} from './tabs/index';
import {useFetchTickets, useRootCauseOwner} from '../hooks';
import {useSelectedBrand, useQueryParamChange} from '../../hooks';
import {impactedBrandToDivision} from '../incidentsHelper';
import './styles.less';

const statusDefaultValue = ALL_STATUSES_OPTION;
const priorityDefaultValue = ALL_PRIORITIES_OPTION;
const tagDefaultValue = ALL_TAGS_OPTION;
const rcOwnerDefaultValue = ALL_RC_OWNERS_OPTION;
const startDateDefaultValue = moment().subtract(14, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();
const partnerDefaultValue = ALL_PARTNERS_OPTION;
const divisionCheckboxesDefaultValue = [
    {text: 'E4P', checked: true},
    {text: 'Rapid', checked: true},
    {text: 'TAAP', checked: true}
];

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
    const isPartnerBrand = selectedBrand === EXPEDIA_PARTNER_SERVICES_BRAND;

    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState(statusDefaultValue);
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [appliedStartDate, setAppliedStartDate] = useState(startDate);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [appliedEndDate, setAppliedEndDate] = useState(endDate);
    const [selectedPriority, setSelectedPriority] = useState(priorityDefaultValue);
    const [selectedTag, setSelectedTag] = useState(tagDefaultValue);
    const [selectedRcOwner, setSelectedRcOwner] = useState(rcOwnerDefaultValue);
    const [selectedPartner, setSelectedPartner] = useState(partnerDefaultValue);
    const [divisionCheckboxes, setDivisionCheckboxes] = useState(divisionCheckboxesDefaultValue);

    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);

    const [tickets, setTickets] = useState([]);

    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [
        isLoading,
        error,
        allUniqueIncidents,
        allIncidents,
        incidentsPriorities,
        incidentsStatuses,
        incidentsTags,
        incidentPartners
    ] = useFetchTickets(
        isApplyClicked,
        startDate,
        endDate,
        applyFilters,
        setIsApplyClicked,
        'incidents',
        selectedBrand
    );
    const rootCauseOwners = useRootCauseOwner(selectedBrand, allUniqueIncidents);
    useQueryParamChange(selectedBrand, props.onBrandChange);
    useSelectedBrand(selectedBrand, props.onBrandChange, props.prevSelectedBrand);

    function applyFilters() {
        const matchesPriority = (t) => selectedPriority === priorityDefaultValue || t.priority === selectedPriority;
        const matchesBrand = (t) => (selectedBrand === EG_BRAND
            || (t.impactedBrand || '').split(',').some((iBrand) => selectedBrand === impactedBrandToDivision(iBrand)));
        const matchesStatus = (t) => selectedStatus === statusDefaultValue || t.status === selectedStatus;
        const matchesTag = (t) => selectedTag === tagDefaultValue || t.tag === selectedTag || (Array.isArray(t.tag) && t.tag.includes(selectedTag));
        const matchesRcOwner = (t) => selectedRcOwner === rcOwnerDefaultValue || t['RC Owner'] === selectedRcOwner;
        const matchesDivision = (t) => !isPartnerBrand || divisionCheckboxes.find((cbox) => cbox.checked && (t.partner_divisions || []).includes(cbox.text));
        const matchesPartner = (t) => !isPartnerBrand || selectedPartner === partnerDefaultValue ||
            (t.impactedPartnersLobs && t.impactedPartnersLobs.includes(selectedPartner));
        // eslint-disable-next-line complexity
        const filterTickets = (t) => (matchesPriority(t) && matchesBrand(t) && matchesStatus(t) && matchesTag(t) && matchesRcOwner(t)
            && matchesPartner(t) && matchesDivision(t));
        setTickets([...allUniqueIncidents].filter(filterTickets));

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
        setTickets([]);
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
    }, []);

    const handlePartnerChange = useCallback((partner) => {
        setSelectedPartner(partner);
        setIsDirtyForm(true);
    }, []);

    const handleCheckboxChange = (c) => {
        const nextCheckboxes = JSON.parse(JSON.stringify(divisionCheckboxes));
        const idx = divisionCheckboxes.findIndex((cbox) => cbox.text === c.text);
        nextCheckboxes[idx].checked = !divisionCheckboxes[idx].checked;
        setDivisionCheckboxes(nextCheckboxes);
        setIsDirtyForm(true);
    };

    const handleShowMoreFilters = () => {
        setShowMoreFilters(!showMoreFilters);
    };

    // eslint-disable-next-line complexity
    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return <Overview startDate={appliedStartDate} endDate={appliedEndDate} tickets={tickets} brand={selectedBrand} />;
            case 1:
                return <Incidents tickets={tickets} selectedBrand={selectedBrand} />;
            case 2:
                return <Top5 tickets={tickets} />;
            case 3:
                return <FinancialImpact startDate={appliedStartDate} endDate={appliedEndDate} tickets={tickets} brand={selectedBrand} />;
            default:
                return <Incidents tickets={tickets} />;
        }
    };

    const renderDivisionCheckbox = (c) => (
        <Checkbox
            key={`column-${c.text}`}
            size="sm"
            className="checkbox-column col-xs-3"
            name={c.text}
            label={c.text}
            checked={c.checked}
            onChange={() => handleCheckboxChange(c)}
        />
    );

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
                {isPartnerBrand ? (
                    <FilterDropDown
                        id="partner-dropdown"
                        className="filter-dropdown partner-dropdown"
                        list={incidentPartners}
                        selectedValue={selectedPartner}
                        onClickHandler={handlePartnerChange}
                    />
                ) : (
                    <FilterDropDown
                        id="tag-dropdown"
                        className="tag-dropdown"
                        list={incidentsTags}
                        selectedValue={selectedTag}
                        onClickHandler={handleTagChange}
                    />
                )}
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
            {isPartnerBrand && (
                <div className="division-container">
                    <div className="checkboxes-container">{divisionCheckboxes.map(renderDivisionCheckbox)}</div>
                </div>
            )}
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
