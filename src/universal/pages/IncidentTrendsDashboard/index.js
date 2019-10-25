import React, {Component, Fragment} from 'react';
import moment from 'moment';
import 'moment-timezone';
import * as h from '../../components/utils/formatDate';
import PropTypes from 'prop-types';
import LoadingContainer from '../../components/LoadingContainer';
import {Navigation} from '@homeaway/react-navigation';
import DatePicker from '../../components/DatePicker/index'

import {
    RC_PORTFOLIOS,
    RC_PORTFOLIO_GROUPS,
    IMPACTED_PORTFOLIOS,
    IMPACTED_PORTFOLIO_GROUPS,
    DATE_FORMAT
} from './constants';
import {
    Incidents
} from './tabs/index';
import './styles.less';

class IncidentTrendsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            portfolios: [],
            selectedRCPortfolio: RC_PORTFOLIOS,
            selectedRCPortfolioGroup: RC_PORTFOLIO_GROUPS,
            isLoading: true,
            error: null,
            presetText: 'Last 7 Days',
            startDate: '',
            endDate: '',
            incType: 'Production',
            incPriority: 'All - P1 & P2',
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

        this.links = [
            {id: 'incidents', label: 'Incidents', href: '/incident-trends/incidents'}
        ];
        
    }
    
    getAllIncidents = (data = []) => {
        return data.map((incident) => ({
            'incident_summary': incident['Short Description'], 
            'incident_number': incident.Incident,
            'startedAt': incident.OpenDate,
            'Root_Cause': incident['Root Cause'],
            'priority': incident['ticketPriority'],
            'duration': h.formatDurationToHours(incident['Inc Duration']),
            'Root_Cause_Owner': incident['Root Cause Owner'],
            'Brand': incident.Brand,
            'Status': incident.ticketStatus
        }));
    };

    loadIncident = () => {
        fetch('api/incident-data')
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({error: true});
                    throw new Error;
                }
                return resp.json();
            })
            .then((data) => {
                const allIncidents = this.getAllIncidents(data.recordset);
                this.setState({
                    allIncidents,
                    isLoading: false
                })
            })
            // eslint-disable-next-line no-console
            .catch((error) => {console.log(error)})
    }

    handleDateRangeChange = (startDate, endDate) => {
        const params = {
            endDate: endDate || this.state.endDate,
            startDate: startDate || this.state.startDate
        }
        const filteredIncidents = this.state.allIncidents.filter(
            inc => 
                moment(inc.startedAt).format(DATE_FORMAT) >= params.startDate && 
                moment(inc.startedAt).format(DATE_FORMAT) <= params.endDate)
        this.setState({filteredIncidents, ...params});
    }

    handleClearDates = () => {
        const endDate = '', startDate = '';
        this.setState({
            filteredIncidents:[], 
            startDate, 
            endDate});
    }

    // ==================
    // TABS / ROUTES
    // ==================

    renderIncidentsTab = () => {
        const {
            allIncidents =[], 
            filteredIncidents =[], 
            startDate = '', 
            endDate = ''} = this.state;
        const displayIncidents = startDate || endDate ? filteredIncidents : allIncidents;
        return <Incidents
            allIncidents={allIncidents}
            filteredIncidents={displayIncidents}
        />
    }
    
    componentDidMount() {
        this.loadIncident();
    }
    
    render() {
        const {allIncidents, activeIndex, error, isLoading, startDate, endDate} = this.state;
        return (
            <Fragment>
                <h1>Incidents trends</h1>
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    minDate={moment('2019-08-01').toDate()}
                    handleDateRangeChange={this.handleDateRangeChange}
                    handleClearDates={this.handleClearDates}
                />
                <Navigation
                    noMobileSelect
                    activeIndex={activeIndex}
                    links={this.links}
                    onLinkClick={this.handleNavigationClick}
                />
                    <LoadingContainer isLoading={isLoading} error={error}>
                    { allIncidents.length && this.renderIncidentsTab()}
                    </LoadingContainer>
            </Fragment>
        );
    }
}

IncidentTrendsDashboard.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array,
};
export default IncidentTrendsDashboard;