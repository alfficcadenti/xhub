import React, {Component, Fragment} from 'react';
import moment from 'moment';
import 'moment-timezone';
import PropTypes from 'prop-types';
import LoadingContainer from '../../components/LoadingContainer';
import FilterDropDown from '../../components/FilterDropDown';
import {Navigation} from '@homeaway/react-navigation';
import DatePicker from '../../components/DatePicker/index'

import {
    RC_PORTFOLIOS,
    RC_PORTFOLIO_GROUPS,
    IMPACTED_PORTFOLIOS,
    IMPACTED_PORTFOLIO_GROUPS,
    DATE_FORMAT,
    PRIORITIES,
    BRANDS
} from './constants';
import {
    Incidents, Overview
} from './tabs/index';
import './styles.less';

const brandDefaultValue = 'All';
const priorityDefaultValue = 'All - P1 & P2';
const endDateDefaultValue = moment().format(DATE_FORMAT)
const startDateDefaultValue = moment("2019-01-01").format(DATE_FORMAT)

class IncidentTrendsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            selectedBrand: brandDefaultValue,
            portfolios: [],
            selectedRCPortfolio: RC_PORTFOLIOS,
            selectedRCPortfolioGroup: RC_PORTFOLIO_GROUPS,
            isLoading: true,
            error: '',
            presetText: 'Last 6 Months',
            startDate: startDateDefaultValue,
            endDate: endDateDefaultValue,
            minDate: moment('2019-01-01').toDate(),
            incType: 'Production',
            incPriority: priorityDefaultValue,
            allIncidents: [],
            meanTrendsData: [],
            filteredIncidents: [],
            pirData: [],
            counter: {},
            filteredRcas: [],
            monthlyTrendData: {},
            weeklyTrendData: {},
            p1P2RadioValue: 'p1RadioIncidents',
            meanTimeTrendsData: {},
            showMoreFilters: false,
            selectedImpactedPortfolioGroup: IMPACTED_PORTFOLIO_GROUPS,
            selectedImpactedPortfolio: IMPACTED_PORTFOLIOS,
            datePickerOpen: false
        };

        this.navLinks = [
            {
                id: 'incidents', 
                label: 'Incidents'
            },
            {
                id: 'overview', 
                label: 'Overview', 
            }   
        ];


        
    }
    
    getAllIncidents = (data = []) => {
        return data.map((inc) => ({
            'incident_summary': inc.incidentSummary, 
            'incident_number': inc.incidentNumber,
            'startedAt': inc.startedAt,
            'Root_Cause': inc.rootCause,
            'priority': inc.priority,
            'duration': inc.duration,
            'Root_Cause_Owner': inc.rootCauseOwner,
            'Brand': inc.brand,
            'Status': inc.status
        }));
    };

    loadIncident = () => {
        fetch('/api/v1/incidents')
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({error: 'Incidents not available. Try to refresh'});
                    throw new Error;
                }
                return resp.json();
            })
            .then((data) => {
                const allIncidents = this.getAllIncidents(data);
                this.setState({
                    allIncidents,
                    filteredIncidents: allIncidents,
                    isLoading: false
                })
            })
            // eslint-disable-next-line no-console
            .catch((error) => {console.log(error)})
    }

    handleNavigationClick = async (e, activeIndex) => {
        this.setState({
            activeIndex
        });
    }

    handleDateRangeChange = (startDate, endDate) => {
        const params = {
            endDate: endDate || this.state.endDate,
            startDate: startDate || this.state.startDate
        }
        this.setState({...params});
    }

    handleClearDates = () => {
        const endDate = '', startDate = '';
        this.setState({
            filteredIncidents:[], 
            startDate, 
            endDate});
    }

    handlePriorityChange = (incPriority) => (
        this.setState({incPriority})
    )

    handleBrandChange = (selectedBrand) => {
        this.setState({selectedBrand})
    }

    applyFilters = () => {
        const {allIncidents, startDate, endDate, incPriority, selectedBrand} = this.state;
        let filteredIncidents = allIncidents;
        if(startDate || endDate) {
            filteredIncidents = filteredIncidents.filter(
                inc => (
                    moment(inc.startedAt).format(DATE_FORMAT) >= startDate && 
                    moment(inc.startedAt).format(DATE_FORMAT) <= endDate)
                )
        }
        if(incPriority != priorityDefaultValue) {
            filteredIncidents = filteredIncidents.filter(
                inc => (inc.priority === incPriority)
            )
        }
        if(selectedBrand != brandDefaultValue) {
            filteredIncidents = filteredIncidents.filter(
                inc => (inc.Brand === selectedBrand)
            )
        }
        this.setState({filteredIncidents});
    }

    // ==================
    //         TABS 
    // ==================

    renderIncidentsTab = (filteredIncidents) => {
        return <Incidents
            filteredIncidents={filteredIncidents}
        />
    }

    renderOverviewTab = (filteredIncidents) => {
        return <Overview
            filteredIncidents={filteredIncidents}
        />
    }
    
    componentDidMount() {
        this.loadIncident();
    }
    
    render() {
        const {activeIndex, error, isLoading, startDate, endDate, minDate, incPriority, selectedBrand, filteredIncidents} = this.state;
        return (
            <Fragment>
                <h1 id='pageTitle'>Incidents trends</h1>
                <div id='filters-div'>
                    <DatePicker
                        startDate={startDate}
                        endDate={endDate}
                        minDate={minDate}
                        handleDateRangeChange={this.handleDateRangeChange}
                        handleClearDates={this.handleClearDates}
                    />
                    <FilterDropDown id='priority-dropdown' list={PRIORITIES} selectedValue={incPriority} onClickHandler={this.handlePriorityChange}/>
                    <FilterDropDown id='brand-dropdown' list={BRANDS} selectedValue={selectedBrand} onClickHandler={this.handleBrandChange}/>
                    <button 
                        id='applyButton'
                        type="button" 
                        className='btn btn-default active' 
                        onClick={this.applyFilters}>
                        Apply
                    </button>
                </div>
                <Navigation
                    noMobileSelect
                    activeIndex={activeIndex}
                    links={this.navLinks}
                    onLinkClick={this.handleNavigationClick}
                />
                    <LoadingContainer isLoading={isLoading} error={error} id={'incident-main-div'}>
                        {activeIndex === 0 ? this.renderIncidentsTab(filteredIncidents) : this.renderOverviewTab(filteredIncidents)}
                    </LoadingContainer>
            </Fragment>
        );
    }
}

IncidentTrendsDashboard.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array,
    location: PropTypes.object
};
export default IncidentTrendsDashboard;