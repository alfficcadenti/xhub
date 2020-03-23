import React, {Fragment, useState, useEffect} from 'react';
import moment from 'moment';
import 'moment-timezone';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import {Navigation} from '@homeaway/react-navigation';
import DatePicker from '../../components/DatePicker/index';
import {Checkbox} from '@homeaway/react-form-components';
import {getUniqueIncidents, adjustIncidentProperties} from './incidentsHelper';
import {DATE_FORMAT, PRIORITIES, BRANDS} from './constants';
import {Incidents, Overview, Top5, Quality, FinancialImpact} from './tabs/index';
import './styles.less';


const brandDefaultValue = 'All';
const priorityDefaultValue = 'All - P1 & P2';
const covidTagDefaultValue = true;
const startDateDefaultValue = moment().subtract(7, 'weeks').format(DATE_FORMAT);
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
        id: 'quality',
        label: 'Quality',
        href: '/quality'
    },
    {
        id: 'financialImpact',
        label: 'Financial Impact',
        href: '/incident-trends'
    },
];


const IncidentTrendsDashboard = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedBrand, setSelectedBrand] = useState(brandDefaultValue);
    const [selectedCovidTag, setSelectedCovidTag] = useState(covidTagDefaultValue);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [incPriority, setIncPriority] = useState(priorityDefaultValue);
    const [allUniqueIncidents, setAllIUniqueIncidents] = useState([]);
    const [filteredUniqueIncidents, setFilteredUniqueIncidents] = useState([]);
    const [allIncidents, setAllIncidents] = useState([]);
    const [filteredAllIncidents, setFilteredAllIncidents] = useState([]);
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    const applyFilters = () => {
        const isWithinRange = (inc) => !(startDate || endDate) || moment(inc.startedAt).isBetween(startDate, endDate, null, '[]');
        const matchesPriority = (inc) => incPriority === priorityDefaultValue || inc.priority === incPriority;
        const matchesBrand = (inc) => selectedBrand === brandDefaultValue || inc.Brand === selectedBrand;
        const matchesTag = (inc) => !selectedCovidTag || inc.tag.includes('covid-19');
        const filterIncidents = (inc) => isWithinRange(inc) && matchesPriority(inc) && matchesBrand(inc) && matchesTag(inc);
        setFilteredUniqueIncidents([...allUniqueIncidents].filter(filterIncidents));
        setFilteredAllIncidents([...allIncidents].filter(filterIncidents));
        setIsDirtyForm(false);
    };

    useEffect(() => {
        fetch('/api/v1/incidents')
            .then((response) => response.json())
            .then((incidents) => {
                const uniqueIncidents = getUniqueIncidents(incidents);
                setAllIUniqueIncidents(adjustIncidentProperties(uniqueIncidents));
                setAllIncidents(incidents);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Incidents are not available. Try to refresh');
                // eslint-disable-next-line no-console
                console.error(err);
            });
    }, []);

    useEffect(() => {
        applyFilters();
    }, [allUniqueIncidents, allIncidents]);

    const handleNavigationClick = (e, activeLinkIndex) => setActiveIndex(activeLinkIndex);

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

    const handlePriorityChange = (priority) => {
        setIncPriority(priority);
        setIsDirtyForm(true);
    };

    const handleBrandChange = (brand) => {
        setSelectedBrand(brand);
        setIsDirtyForm(true);
    };

    const handleCovidTagChange = () => {
        setSelectedCovidTag(!selectedCovidTag);
        setIsDirtyForm(true);
    };

    // eslint-disable-next-line complexity
    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return <Overview startDate={startDate} endDate={endDate} filteredIncidents={filteredUniqueIncidents} />;
            case 1:
                return <Incidents filteredIncidents={filteredUniqueIncidents} />;
            case 2:
                return <Top5 filteredIncidents={filteredUniqueIncidents} />;
            case 3:
                return <Quality startDate={startDate} endDate={endDate} filteredDefects={filteredUniqueIncidents} />;
            case 4:
                return <FinancialImpact filteredIncidents={filteredAllIncidents} />;
            default:
                return <Incidents filteredIncidents={filteredUniqueIncidents} />;
        }
    };

    return (
        <Fragment>
            <h1 className="page-title">{'Incidents trends'}</h1>
            <div id="filters-wrapper">
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    handleDateRangeChange={handleDateRangeChange}
                    handleClearDates={handleClearDates}
                />
                <FilterDropDown id="priority-dropdown" list={PRIORITIES} selectedValue={incPriority} onClickHandler={handlePriorityChange}/>
                <FilterDropDown id="brand-dropdown" list={BRANDS} selectedValue={selectedBrand} onClickHandler={handleBrandChange}/>
                <Checkbox name="covid-19" label="Covid-19" checked={selectedCovidTag} onChange={handleCovidTagChange}/>
                <button
                    id="applyButton"
                    type="button"
                    className="btn btn-primary active"
                    onClick={applyFilters}
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
            <LoadingContainer isLoading={isLoading} error={error} id={'incident-main'}>
                {renderTabs()}
            </LoadingContainer>
        </Fragment>
    );
};

export default IncidentTrendsDashboard;
