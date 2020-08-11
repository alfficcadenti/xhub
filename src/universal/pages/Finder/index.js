/* eslint-disable no-use-before-define */
import React, {useState, useEffect, useCallback} from 'react';
import moment from 'moment';
import 'moment-timezone';
import {Navigation} from '@homeaway/react-navigation';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import DatePicker from '../../components/DatePicker/index';
import {
    DATE_FORMAT,
    ALL_PRIORITIES_OPTION,
} from '../../constants';
import {
    ALL_PLATFORMS_OPTION,
    ALL_TEAMS_OPTION,
} from './constants';
import {ChangeRequests} from './tabs/index';
import {useFetchCRs} from './hooks';
import {EG_BRAND} from '../../constants';
import {useSelectedBrand, useQueryParamChange} from '../hooks';
import './styles.less';
// import {getBrand} from '../utils';

const platformDefaultValue = ALL_PLATFORMS_OPTION;
const priorityDefaultValue = ALL_PRIORITIES_OPTION;
const teamDefaultValue = ALL_TEAMS_OPTION;
const startDateDefaultValue = moment().subtract(7, 'days').format(DATE_FORMAT);
const endDateDefaultValue = moment().format(DATE_FORMAT);
const minDate = moment('2019-01-01').toDate();
const navLinks = [
    {
        id: 'changeRequests',
        label: 'Change Requests',
        href: '/change-requests'
    }
];


const Finder = (props) => {
    const selectedBrand = props.selectedBrands[0];

    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedPlatform, setSelectedPlatform] = useState(platformDefaultValue);
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [selectedPriority, setSelectedPriority] = useState(priorityDefaultValue);
    const [selectedTeam, setSelectedTeam] = useState(teamDefaultValue);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [filteredUniqueCRs, setFilteredUniqueCRs] = useState([]);
    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [
        isLoading,
        error,
        allUniqueCRs,
        allCRs,
        dataPriorities,
        dataPlatforms,
        dataTeams
    ] = useFetchCRs(
        isApplyClicked,
        startDate,
        endDate,
        applyFilters,
        setIsApplyClicked
    );
    useQueryParamChange(selectedBrand, props.onBrandChange);
    useSelectedBrand(selectedBrand, props.onBrandChange, props.prevSelectedBrand);

    function applyFilters() {
        const matchesPriority = (t) => selectedPriority === priorityDefaultValue || t.priority === selectedPriority;
        const matchesBrand = (t) => selectedBrand === EG_BRAND || selectedBrand === t.Brand;
        const matchesPlatform = (t) => selectedPlatform === platformDefaultValue || t.platform === selectedPlatform;
        const matchesTeam = (t) => selectedTeam === teamDefaultValue || t.team === selectedTeam || t.team === selectedTeam;
        const filterCRs = (t) => matchesBrand(t) && matchesPriority(t) && matchesPlatform(t) && matchesTeam(t);
        setFilteredUniqueCRs([...allUniqueCRs].filter(filterCRs));
        setIsDirtyForm(false);
    }

    useEffect(() => {
        applyFilters();
    }, [allUniqueCRs, allCRs]);

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
        setFilteredUniqueCRs([]);
        setIsDirtyForm(true);
    };

    const handlePriorityChange = useCallback((priority) => {
        setSelectedPriority(priority);
        setIsDirtyForm(true);
    }, []);

    const handlePlatformChange = useCallback((platform) => {
        setSelectedPlatform(platform);
        setIsDirtyForm(true);
    }, []);

    const handleTeamChange = useCallback((team) => {
        setSelectedTeam(team);
        setIsDirtyForm(true);
    }, []);

    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return <ChangeRequests filteredCR={filteredUniqueCRs} />;
            default:
                return <ChangeRequests filteredCR={filteredUniqueCRs} />;
        }
    };

    return (
        <div className="change-requests-container">
            <h1 className="page-title">{'Change Finder'}</h1>
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
                    list={dataPriorities}
                    selectedValue={selectedPriority}
                    onClickHandler={handlePriorityChange}
                />
                <FilterDropDown
                    id="platform-dropdown"
                    className="platform-dropdown"
                    list={dataPlatforms}
                    selectedValue={selectedPlatform}
                    onClickHandler={handlePlatformChange}
                />
                <FilterDropDown
                    id="team-dropdown"
                    className="team-dropdown"
                    list={dataTeams}
                    selectedValue={selectedTeam}
                    onClickHandler={handleTeamChange}
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
            </div>
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={navLinks}
                onLinkClick={handleNavigationClick}
            />
            <LoadingContainer isLoading={isLoading} error={error}>
                {renderTabs()}
            </LoadingContainer>
        </div>
    );
};

export default Finder;
