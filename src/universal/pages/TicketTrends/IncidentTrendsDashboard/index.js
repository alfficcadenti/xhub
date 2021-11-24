import React, {useState, useEffect, useCallback} from 'react';
import moment from 'moment';
import {withRouter, useHistory, useLocation} from 'react-router-dom';
import {Divider} from '@homeaway/react-collapse';
import {Checkbox} from '@homeaway/react-form-components';
import {Navigation} from '@homeaway/react-navigation';
import {SVGIcon} from '@homeaway/react-svg';
import {FILTER__16} from '@homeaway/svg-defs';
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
import {Incidents, Overview, Top5, Incident} from './tabs/index';
import {useFetchTickets, useRootCauseOwner} from '../hooks';
import {useSelectedBrand, useQueryParamChange} from '../../hooks';
import {impactedBrandToDivision} from '../incidentsHelper';
import {DatetimeRangePicker} from '../../../components/DatetimeRangePicker';
import {
    DIVISION_CHECKBOXES,
    NAV_LINKS
} from './constants';
import {getQueryValues} from './utils';
import './styles.less';


const IncidentTrendsDashboard = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const {search} = useLocation();
    const history = useHistory();
    const {initialStart, initialEnd, initialStatus, initialPriority, initialTag} = getQueryValues(search);

    const selectedBrand = selectedBrands[0];
    const isPartnerBrand = selectedBrand === EXPEDIA_PARTNER_SERVICES_BRAND;

    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [start, setStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [end, setEnd] = useState(initialEnd);
    const [selectedPriority, setSelectedPriority] = useState(initialPriority);
    const [selectedTag, setSelectedTag] = useState(initialTag);
    const [selectedRcOwner, setSelectedRcOwner] = useState(ALL_RC_OWNERS_OPTION);
    const [selectedPartner, setSelectedPartner] = useState(ALL_PARTNERS_OPTION);
    const [divisionCheckboxes, setDivisionCheckboxes] = useState(DIVISION_CHECKBOXES);

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
        pendingStart,
        pendingEnd,
        // eslint-disable-next-line no-use-before-define
        applyFilters,
        setIsApplyClicked,
        'incidents',
        selectedBrands
    );
    const rootCauseOwners = useRootCauseOwner(selectedBrand, allUniqueIncidents);
    useQueryParamChange(selectedBrand, onBrandChange);
    useSelectedBrand(selectedBrand, onBrandChange, prevSelectedBrand);

    function applyFilters() {
        const matchesPriority = (t) => selectedPriority === ALL_PRIORITIES_OPTION || t.priority === selectedPriority;
        const matchesBrand = (t) => (selectedBrand === EG_BRAND
            || (t.impacted_brand || '').split(',').some((iBrand) => selectedBrand === impactedBrandToDivision(iBrand)));
        const matchesStatus = (t) => selectedStatus === ALL_STATUSES_OPTION || t.status === selectedStatus;
        const matchesTag = (t) => selectedTag === ALL_TAGS_OPTION || t.tag === selectedTag || (Array.isArray(t.tag) && t.tag.includes(selectedTag));
        const matchesRcOwner = (t) => selectedRcOwner === ALL_RC_OWNERS_OPTION || t['RC Owner'] === selectedRcOwner;
        const matchesDivision = (t) => !isPartnerBrand || divisionCheckboxes.find((cbox) => cbox.checked && (t.partner_divisions || []).includes(cbox.text));
        const matchesPartner = (t) => !isPartnerBrand || selectedPartner === ALL_PARTNERS_OPTION ||
            (t.impactedPartnersLobs && t.impactedPartnersLobs.includes(selectedPartner));
        // eslint-disable-next-line complexity
        const filterTickets = (t) => (matchesPriority(t) && matchesBrand(t) && matchesStatus(t) && matchesTag(t) && matchesRcOwner(t)
            && matchesPartner(t) && matchesDivision(t));
        const browserTimezone = moment.tz.guess();
        setTickets([...allUniqueIncidents].filter(filterTickets));
        setStart(moment(pendingStart).tz(browserTimezone).toISOString());
        setEnd(moment(pendingEnd).tz(browserTimezone).toISOString());
        setIsDirtyForm(false);

        history.push(`/incident-trends?selectedBrand=${selectedBrands[0]}`
            + `&from=${encodeURIComponent(pendingStart)}`
            + `&to=${encodeURIComponent(pendingEnd)}`
            + `&priority=${selectedPriority}`
            + `&status=${selectedStatus}`
            + `&tag=${selectedTag}`
        );
    }

    useEffect(() => {
        applyFilters();
    }, [allUniqueIncidents, allIncidents]);

    const handleNavigationClick = (e, activeLinkIndex) => {
        setActiveIndex(activeLinkIndex);
    };

    const handleDateRangeChange = ({start: startDate, end: endDate}) => {
        setPendingStart(moment(startDate).format(DATE_FORMAT));
        setPendingEnd(moment(endDate).format(DATE_FORMAT));
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
                return <Overview startDate={start} endDate={end} tickets={tickets} brand={selectedBrand} />;
            case 1:
                return <Incidents tickets={tickets} selectedBrand={selectedBrand} />;
            case 2:
                return <Top5 tickets={tickets} />;
            case 3:
                return <Incident tickets={tickets} />;
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
                <DatetimeRangePicker
                    onChange={handleDateRangeChange}
                    startDate={moment(pendingStart).toDate()}
                    endDate={moment(pendingEnd).toDate()}
                    showTimePicker
                    hidePresets
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
                links={NAV_LINKS}
                onLinkClick={handleNavigationClick}
            />
            <LoadingContainer isLoading={isLoading} error={error} className="incident-main">
                {renderTabs()}
            </LoadingContainer>
        </div>
    );
};

export default withRouter(IncidentTrendsDashboard);
