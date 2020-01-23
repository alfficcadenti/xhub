import React, {Fragment, useState, useEffect} from 'react';
import moment from 'moment';
import 'moment-timezone';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import {Navigation} from '@homeaway/react-navigation';
import DatePicker from '../../components/DatePicker/index';
import h, {extractBrandNames, prepareBrandLossData} from './incidentsHelper';
import {DATE_FORMAT, PRIORITIES, BRANDS} from './constants';
import {Incidents, Overview, Top5, LostRevenue} from './tabs/index';
import './styles.less';


const brandDefaultValue = 'All';
const priorityDefaultValue = 'All - P1 & P2';
const startDateDefaultValue = moment().subtract(1, 'month').format(DATE_FORMAT);
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
        id: 'lostRevenue',
        label: 'Lost Revenue',
        href: '/incident-trends'
    }
];


const IncidentTrendsDashboard = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedBrand, setSelectedBrand] = useState(brandDefaultValue);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState(startDateDefaultValue);
    const [endDate, setEndDate] = useState(endDateDefaultValue);
    const [incPriority, setIncPriority] = useState(priorityDefaultValue);
    const [allIncidents, setAllIncidents] = useState([]);
    const [filteredIncidents, setFilteredIncidents] = useState([]);
    const [lostRevenues, setLostRevenues] = useState(null);
    const [brands, setBrands] = useState(null);

    const applyFilters = () => {
        let incidents = [...allIncidents];

        if (startDate || endDate) {
            incidents = incidents.filter((inc) =>
                moment(inc.startedAt).format(DATE_FORMAT) >= startDate &&
                moment(inc.startedAt).format(DATE_FORMAT) <= endDate
            );
        }

        if (incPriority !== priorityDefaultValue) {
            incidents = incidents.filter((inc) => inc.priority === incPriority);
        }

        if (selectedBrand !== brandDefaultValue) {
            incidents = incidents.filter((inc) => inc.Brand === selectedBrand);
        }

        setFilteredIncidents(incidents);
    };

    useEffect(() => {
        const lostRevenueStartDate = '2019-10-28';
        const lostRevenueEndDate = '2020-01-19';

        const requests = [
            fetch('/api/v1/incidents'),
            fetch(`/api/v1/lostrevenue?startDate=${lostRevenueStartDate}&endDate=${lostRevenueEndDate}`)
        ];

        Promise.all(requests.map((request) => {
            return request
                .then((response) => response.json()
                    .then((data) => data));
        }))
            .then(([incidents, revenues]) => {
                const rawIncidents = h.getAllIncidents(incidents);
                setAllIncidents(rawIncidents);

                const brandNames = extractBrandNames(revenues);
                const allLostRevenues = prepareBrandLossData(revenues, brandNames);

                setBrands(brandNames);
                setLostRevenues(allLostRevenues);

                setIsLoading(false);
            })
            .catch((err) => {
                setError('Incidents not available. Try to refresh');
                // eslint-disable-next-line no-console
                console.log(err);
            });
    }, []);

    useEffect(() => {
        applyFilters();
    }, [allIncidents]);

    const handleNavigationClick = async (e, activeLinkIndex) => setActiveIndex(activeLinkIndex);

    const handleDateRangeChange = (start, end) => {
        setStartDate(start || startDate);
        setEndDate(end || endDate);
    };

    const handleClearDates = () => {
        setStartDate('');
        setEndDate('');
        setFilteredIncidents([]);
    };

    const handlePriorityChange = (priority) => setIncPriority(priority);

    const handleBrandChange = (brand) => setSelectedBrand(brand);

    const renderTabs = () => {
        switch (activeIndex) {
            case 0:
                return <Overview filteredIncidents={filteredIncidents} />;
            case 1:
                return <Incidents filteredIncidents={filteredIncidents} />;
            case 2:
                return <Top5 filteredIncidents={filteredIncidents} />;
            case 3:
                return <LostRevenue lostRevenues={lostRevenues} brands={brands}/>;
            default:
                return <Overview filteredIncidents={filteredIncidents} />;
        }
    };

    return (
        <Fragment>
            <h1 id="pageTitle">{'Incidents trends'}</h1>
            <div id="filters-div">
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    handleDateRangeChange={handleDateRangeChange}
                    handleClearDates={handleClearDates}
                />
                <FilterDropDown id="priority-dropdown" list={PRIORITIES} selectedValue={incPriority} onClickHandler={handlePriorityChange}/>
                <FilterDropDown id="brand-dropdown" list={BRANDS} selectedValue={selectedBrand} onClickHandler={handleBrandChange}/>
                <button
                    id="applyButton"
                    type="button"
                    className="btn btn-default active"
                    onClick={applyFilters}
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
            <LoadingContainer isLoading={isLoading} error={error} id={'incident-main-div'}>
                {renderTabs()}
            </LoadingContainer>
        </Fragment>
    );
};

export default IncidentTrendsDashboard;
