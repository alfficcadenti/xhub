import React, {useState, useEffect} from 'react';
import {useHistory, useLocation, withRouter} from 'react-router-dom';
import moment from 'moment';
import {Checkbox} from '@homeaway/react-form-components';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import LoadingContainer from '../../components/LoadingContainer';
import HelpText from '../../components/HelpText/HelpText';
import {VRBO_BRAND, HOTELS_COM_BRAND, OPXHUB_SUPPORT_CHANNEL} from '../../constants';
import {
    BarChartPanel,
    DurationPanel,
    TwoDimensionalPanel,
    PriorityLineChartPanel,
    CreatedVsResolvedPanel,
    PiePanel,
    SLADefinitions
} from './Panels';
import {NOT_PRIORITIZED_LABEL, P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL, P5_LABEL} from './constants';
import {
    getBrandPortfolios,
    getQueryValues,
    getQueryString,
    fetchPanelData,
    filterBrandProjectKeys
} from './utils';
import './styles.less';


const QualityMetrics = ({selectedBrands}) => {
    const history = useHistory();
    const {search} = useLocation();
    const {initialStart, initialEnd, initialProjectKeys} = getQueryValues(search, selectedBrands);
    const initialDataState = {data: {}, isLoading: false, error: null};

    const [isSupportedBrand, setIsSupportedBrand] = useState(true);
    const [brand, setBrand] = useState(selectedBrands[0]);

    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [pendingProjectKeys, setPendingProjectKeys] = useState(initialProjectKeys);
    const [selectedProjectKeys, setSelectedProjectKeys] = useState(initialProjectKeys);
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    const [ticketsData, setTicketsData] = useState(initialDataState);
    const [tdData, setTdData] = useState(initialDataState);
    const [ttrData, setTtrData] = useState(initialDataState);
    const [mttrData, setMttrData] = useState(initialDataState);
    const [cvrData, setCvrData] = useState(initialDataState);
    const [pieData, setPieData] = useState(initialDataState);
    const [dogfoodData, setDogfoodData] = useState(initialDataState);
    const [openDefectsData, setOpenDefectsData] = useState(initialDataState);
    const [slaDefectsData, setSlaDefectsData] = useState(initialDataState);
    const [unprioritizedData, setUnprioritizedData] = useState(initialDataState);

    useEffect(() => {
        setBrand(selectedBrands[0]);
        setIsSupportedBrand([HOTELS_COM_BRAND, VRBO_BRAND].includes(selectedBrands[0]));
    }, [selectedBrands]);

    useEffect(() => {
        const brandProjectKeys = filterBrandProjectKeys(selectedProjectKeys, brand);
        history.push(getQueryString(brand, selectedProjectKeys, start, end));
        if (!isSupportedBrand || !brandProjectKeys.length) {
            return;
        }
        const loadingDataState = {data: {}, isLoading: false, error: null};
        const fetchData = async (panel) => fetchPanelData(start, end, brandProjectKeys, brand, panel);
        setTicketsData(loadingDataState);
        setTdData(loadingDataState);
        setCvrData(loadingDataState);
        setPieData(loadingDataState);
        fetchData().then(setTicketsData);
        fetchData('twoDimensionalStatistics').then(setTdData);
        fetchData('createdVsResolved').then(setCvrData);
        fetchData('piecharts').then(setPieData);
        if (brand === HOTELS_COM_BRAND) {
            setTtrData(loadingDataState);
            fetchData('ttrSummary').then(setTtrData);
        } else if (brand === VRBO_BRAND) {
            setOpenDefectsData(loadingDataState);
            setSlaDefectsData(loadingDataState);
            setMttrData(loadingDataState);
            setDogfoodData(loadingDataState);
            fetchData('opendefects').then(setOpenDefectsData);
            fetchData('opendefectspastsla').then(setSlaDefectsData);
            fetchData('timetoresolve').then(setMttrData);
            fetchData('unprioritized').then(setUnprioritizedData);
            fetchData('dogfood').then(setDogfoodData);
        }
    }, [history, isSupportedBrand, brand, selectedProjectKeys, start, end]);

    const handleDatetimeChange = ({start: startDateTimeStr, end: endDateTimeStr}) => {
        setPendingStart(moment(startDateTimeStr));
        setPendingEnd(moment(endDateTimeStr));
        setIsDirtyForm(true);
    };

    const handleProjectKeyChange = (projectKey) => {
        let projectKeys = [];
        try {
            projectKeys = JSON.parse(JSON.stringify(pendingProjectKeys));
        } catch (e) {
            setTicketsData({data: {}, isLoading: false, error: 'An error occurred when parsing portfolios.'});
        }
        const idx = projectKeys.findIndex((p) => p === projectKey);
        if (idx >= 0) {
            projectKeys.splice(idx, 1);
        } else {
            projectKeys.push(projectKey);
        }
        setPendingProjectKeys(projectKeys);
        setIsDirtyForm(true);
    };

    const handlePortfolioChange = (portfolio) => {
        let projectKeys = [];
        try {
            projectKeys = JSON.parse(JSON.stringify(pendingProjectKeys));
        } catch (e) {
            setTicketsData({data: {}, isLoading: false, error: 'An error occurred when parsing portfolios.'});
        }
        if (portfolio.projects.every((p) => projectKeys.includes(p))) {
            portfolio.projects.forEach((p) => {
                const idx = projectKeys.findIndex((projectKey) => p === projectKey);
                projectKeys.splice(idx, 1);
            });
        } else {
            portfolio.projects.forEach((p) => {
                const idx = projectKeys.findIndex((projectKey) => p === projectKey);
                if (idx < 0) {
                    projectKeys.push(p);
                }
            });
        }

        setPendingProjectKeys(projectKeys);
        setIsDirtyForm(true);
    };

    const handleApplyFilters = () => {
        setStart(pendingStart);
        setEnd(pendingEnd);
        setSelectedProjectKeys(JSON.parse(JSON.stringify(pendingProjectKeys)));
        setIsDirtyForm(false);
    };

    const renderProjectKeyCheckbox = (projectKey) => (
        <Checkbox
            key={`checkbox-${projectKey}`}
            size="sm"
            className="filter-checkbox project-checkbox"
            name={projectKey}
            label={projectKey}
            checked={!!pendingProjectKeys.find((p) => p === projectKey)}
            onChange={() => handleProjectKeyChange(projectKey)}
        />
    );

    const renderPortfolioCheckboxes = (portfolio = {}) => {
        const someProjectKeysChecked = portfolio.projects.some((p) => pendingProjectKeys.includes(p));
        const allProjectKeysChecked = portfolio.projects.every((p) => pendingProjectKeys.includes(p));
        return (
            <div className="portfolio-checkboxes" key={`checkboxes-${portfolio.value}`}>
                <Checkbox
                    size="sm"
                    className="filter-checkbox portfolio-checkbox"
                    name={portfolio.text}
                    label={portfolio.text}
                    indeterminate={someProjectKeysChecked && !allProjectKeysChecked}
                    checked={allProjectKeysChecked}
                    onChange={() => handlePortfolioChange(portfolio)}
                />
                <div className="project-checkboxes-container">
                    {portfolio.projects.map(renderProjectKeyCheckbox)}
                </div>
            </div>
        );
    };

    const renderForm = () => (
        <div className="search-form">
            <DatetimeRangePicker
                onChange={handleDatetimeChange}
                startDate={pendingStart.toDate()}
                endDate={pendingEnd.toDate()}
                hidePresets
            />
            <button
                className="btn btn-primary apply-btn"
                type="button"
                onClick={handleApplyFilters}
                disabled={!isDirtyForm}
            >
                {'Apply'}
            </button>
            <div className="checkboxes-container">
                {getBrandPortfolios(brand).map(renderPortfolioCheckboxes)}
            </div>
        </div>
    );

    const renderHcomPanels = () => (
        <>
            <TwoDimensionalPanel
                title="Open Defects"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived'"
                tickets={ticketsData.data}
                panelData={tdData}
                dataKey="openBugs"
                brand={brand}
            />
            <TwoDimensionalPanel
                title="Open Defects By Portfolio"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' by portfolio"
                tickets={ticketsData.data}
                panelData={tdData}
                dataKey="openBugs"
                groupBy="Portfolio"
                brand={brand}
            />
            <DurationPanel
                title="Mean Time to Resolve By Portfolio"
                info="Mean time to resolve in days by portfolio"
                tickets={ticketsData.data}
                panelData={ttrData}
            />
            {[P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL, P5_LABEL].map((priority) => (
                <CreatedVsResolvedPanel
                    key={`${priority} Created vs. Resolved`}
                    title={`${priority} Created vs. Resolved`}
                    info={`Charting ${priority} defects by their open date and resolve date (bucketed by week). Click line point for more details.`}
                    priorities={[priority]}
                    tickets={ticketsData.data}
                    panelData={cvrData}
                />
            ))}
            <PiePanel
                title="Open Defects (w.r.t. Priority)"
                info="Charting all defects with regard to priority. Click pie slice for more details."
                groupBy="Priority"
                tickets={ticketsData.data}
                panelData={pieData}
                dataKey="openBugsByPriority"
            />
        </>
    );

    const renderVrboPanels = () => (
        <>
            <BarChartPanel
                title="Open Defects By Open Date"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' by open date"
                tickets={ticketsData.data}
                panelData={openDefectsData}
                dataKey="openDefects"
            />
            <TwoDimensionalPanel
                title="Open Defects"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived'"
                tickets={ticketsData.data}
                panelData={tdData}
                dataKey="openBugs"
                brand={brand}
            />
            <TwoDimensionalPanel
                title="Open Defects By Portfolio"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' by portfolio"
                tickets={ticketsData.data}
                panelData={tdData}
                dataKey="openBugs"
                groupBy="Portfolio"
                brand={brand}
            />
            <SLADefinitions />
            <BarChartPanel
                title="Open Defects Past SLA"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' and past SLA by open date"
                tickets={ticketsData.data}
                panelData={slaDefectsData}
                dataKey="openDefectsPastSla"
            />
            <TwoDimensionalPanel
                title="Open Defects Past SLA"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' past SLA"
                tickets={ticketsData.data}
                panelData={tdData}
                dataKey="pastSLA"
                brand={brand}
            />
            <PriorityLineChartPanel
                title="Open Defects Past SLA By Open Date"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' and past SLA"
                tickets={ticketsData.data}
                panelData={slaDefectsData}
                dataKey="openDefectsPastSla"
                isFullWidth={false}
            />
            <TwoDimensionalPanel
                title="Open Defects Approaching SLA"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' approaching and before SLA"
                tickets={ticketsData.data}
                panelData={tdData}
                dataKey="approachingSLA"
                brand={brand}
            />
            <PriorityLineChartPanel
                title="Mean Time to Resolve"
                info="The average amount of days between a ticket's create date and resolve date w.r.t. priority"
                tickets={ticketsData.data}
                panelData={mttrData}
                dataKey="timetoresolve"
            />
            <CreatedVsResolvedPanel
                title="Total Created vs. Resolved"
                info="Charting all defects by their open date and resolve date (bucketed by week). Click line point for more details."
                priorities={[P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL, P5_LABEL, 'notPrioritized']}
                tickets={ticketsData.data}
                panelData={cvrData}
                isFullWidth
            />
            <CreatedVsResolvedPanel
                title="P1 Created vs. Resolved"
                info="Charting P1 defects by their open date and resolve date (bucketed by week). Click line point for more details."
                priorities={[P1_LABEL]}
                tickets={ticketsData.data}
                panelData={cvrData}
            />
            <CreatedVsResolvedPanel
                title="P2 Created vs. Resolved"
                info="Charting P2 defects by their open date and resolve date (bucketed by week). Click line point for more details."
                priorities={[P2_LABEL]}
                tickets={ticketsData.data}
                panelData={cvrData}
            />
            <PriorityLineChartPanel
                title="Unprioritized Defects"
                info="Displaying unprioritized defects w.r.t. open date"
                tickets={ticketsData.data}
                panelData={unprioritizedData}
                dataKey="unprioritized"
                priorities={[NOT_PRIORITIZED_LABEL]}
            />
            <PriorityLineChartPanel
                title="Open Dogfood Defects"
                info="Displaying dogfood defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' and past SLA"
                tickets={ticketsData.data}
                panelData={dogfoodData}
                dataKey="dogfood"
            />
            <PiePanel
                title="Open Defects (w.r.t. Priority)"
                info="Charting all defects with regard to priority. Click pie slice for more details."
                groupBy="Priority"
                tickets={ticketsData.data}
                panelData={pieData}
                dataKey="openBugsByPriority"
            />
            <PiePanel
                title="Open Defects (w.r.t. Project)"
                info="Charting all defects with regard to project. Click pie slice for more details."
                groupBy="Project"
                tickets={ticketsData.data}
                panelData={pieData}
                dataKey="openBugsByProject"
            />
        </>
    );

    const renderBody = () => (
        <>
            {renderForm()}
            {(!filterBrandProjectKeys(selectedProjectKeys, brand)?.length)
                ? <div className="no-results">{'No Project Selected'}</div>
                : (
                    <div className="panels-container">
                        <LoadingContainer isLoading={ticketsData.isLoading} error={ticketsData.error}>
                            {(brand === HOTELS_COM_BRAND) ? renderHcomPanels() : renderVrboPanels()}
                        </LoadingContainer>
                    </div>
                )
            }
        </>
    );

    return (
        <div className="qm-container">
            <h1 className="page-title">
                {'Quality Metrics'}
                <HelpText className="page-info" text="Quality metrics of defects" />
            </h1>
            {isSupportedBrand
                ? renderBody()
                : <div className="messaged">{`Quality Metrics for ${selectedBrands} is not yet available.
                    The following brands are supported at this time: "Hotels.com Retail", "Vrbo Retail".
                    If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`}</div>
            }
        </div>
    );
};

export default withRouter(QualityMetrics);
