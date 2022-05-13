import React, {useState, useCallback, useEffect} from 'react';
import {useHistory, useLocation, withRouter} from 'react-router-dom';
import moment from 'moment';
import {Navigation} from '@homeaway/react-navigation';

import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import FilterDropDown from '../../components/FilterDropDown';
import LoadingContainer from '../../components/LoadingContainer';
import Overview from './tabs/Overview';
import Issues from './tabs/Issues';

import {generateUrl, getActiveIndex, getQueryValues, getPresets} from './utils';
import {validDateRange} from '../utils';
import {useFetchIssues} from './hooks';
import {useQueryParamChange, useSelectedBrand} from '../hooks';

import {NAV_LINKS} from './constants';
import {DATE_FORMAT, ALL_STATUSES_OPTION, ALL_PROJECTS_OPTION} from '../../constants';


import './styles.less';

const DogFood = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const history = useHistory();
    const {pathname, search} = useLocation();

    const {
        initialStart,
        initialEnd,
        initialTimeRange,
        initialStatus,
        initialProject
    } = getQueryValues(search);

    useQueryParamChange(onBrandChange);
    useSelectedBrand(selectedBrands[0], prevSelectedBrand);

    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [startDate, setStartDate] = useState(initialStart);
    const [endDate, setEndDate] = useState(initialEnd);
    const [timeRange, setTimeRange] = useState(initialTimeRange);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [currentStatuses, setCurrentStatuses] = useState([]);
    const [selectedProject, setSelectedProject] = useState(initialProject);
    const [currentProjects, setCurrentProjects] = useState([]);

    const [activeIndex, setActiveIndex] = useState(getActiveIndex(pathname));
    const [filteredIssues, setFilteredIssues] = useState([]);

    const updateHistory = () => history.push(generateUrl(
        activeIndex,
        selectedBrands,
        startDate,
        endDate,
        selectedStatus,
        selectedProject
    ));

    // Filters
    const matchesProject = (x) => selectedProject === ALL_PROJECTS_OPTION || x.Project === selectedProject;
    const matchesStatus = (x) => selectedStatus === ALL_STATUSES_OPTION || x.Status === selectedStatus;

    const filterIssues = (x) => matchesProject(x) && matchesStatus(x);

    const applyFilters = () => {
        if (!validDateRange(startDate, endDate)) {
            const values = getQueryValues(search);
            setStartDate(values.initialStart);
            setEndDate(values.initialEnd);
        }
        // eslint-disable-next-line no-use-before-define
        const result = allIssues.filter(filterIssues);
        setFilteredIssues(result);
        updateHistory();
        setIsDirtyForm(false);
    };

    const [
        isLoading,
        errorMessage,
        allIssues
    ] = useFetchIssues(
        isApplyClicked,
        startDate,
        endDate,
        applyFilters,
        setIsApplyClicked,
        setCurrentProjects,
        setCurrentStatuses
    );

    useEffect(() => {
        applyFilters();
    }, [allIssues]);

    useEffect(() => {
        updateHistory();
    }, [selectedStatus, selectedProject, activeIndex]);

    const handleNavigationClick = (e, activeLinkIndex) => {
        setActiveIndex(activeLinkIndex);
    };

    const handleDateRangeChange = ({start, end}, text) => {
        setTimeRange(text || timeRange);
        setStartDate(moment(start).format(DATE_FORMAT));
        if (!!end || (!end && moment(start).isAfter(endDate))) {
            setEndDate(moment(end).format(DATE_FORMAT));
        }
        setIsDirtyForm(true);
    };

    const handleStatusChange = useCallback((status) => {
        setSelectedStatus(status);
        setIsDirtyForm(true);
    }, []);

    const handleProjectChange = useCallback((project) => {
        setSelectedProject(project);
        setIsDirtyForm(true);
    }, []);

    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return <Overview issues={filteredIssues}/>;
            case 1:
                return <Issues issues={filteredIssues} />;
            default:
                return <Overview issues={filteredIssues}/>;
        }
    };

    const renderFilters = () => {
        return (
            <div className="filters-wrapper">
                <DatetimeRangePicker
                    onChange={handleDateRangeChange}
                    startDate={moment(startDate).toDate()}
                    endDate={moment(endDate).toDate()}
                    presets={getPresets()}
                />
                <FilterDropDown
                    id="status-dropdown"
                    className={'filter-dropdown status-dropdown'}
                    list={[ALL_STATUSES_OPTION, ...currentStatuses]}
                    selectedValue={selectedStatus}
                    onClickHandler={handleStatusChange}
                />
                <FilterDropDown
                    id="project-dropdown"
                    className={'filter-dropdown project-dropdown'}
                    list={[ALL_PROJECTS_OPTION, ...currentProjects]}
                    selectedValue={selectedProject}
                    onClickHandler={handleProjectChange}
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
        );
    };

    return (
        <div className="dog-food-container">
            <h1 className="page-title">
                {'Dog Food'}
            </h1>
            {renderFilters()}
            <Navigation
                noMobileSelect
                activeIndex={activeIndex}
                links={NAV_LINKS}
                onLinkClick={handleNavigationClick}
            />
            <LoadingContainer isLoading={isLoading} error={errorMessage}>
                {renderTabs()}
            </LoadingContainer>
        </div>
    );
};

export default withRouter(DogFood);
