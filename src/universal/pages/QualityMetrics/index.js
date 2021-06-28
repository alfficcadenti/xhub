import React, {useState, useEffect} from 'react';
import {useHistory, useLocation, withRouter} from 'react-router-dom';
import moment from 'moment';
import {SVGIcon} from '@homeaway/react-svg';
import {QUESTION__16} from '@homeaway/svg-defs';
import {Checkbox} from '@homeaway/react-form-components';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import LoadingContainer from '../../components/LoadingContainer';
import HelpText from '../../components/HelpText/HelpText';
import {VRBO_BRAND, HOTELS_COM_BRAND, OPXHUB_SUPPORT_CHANNEL} from '../../constants';
import {BarChartPanel, DurationPanel, TwoDimensionalPanel, CreatedVsResolvedPanel, PiePanel} from './Panels';
import {P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL, P5_LABEL} from './constants';
import {getBrandPortfolios, filterBrandPortfolios, getQueryValues, getQueryString, fetchPanelData} from './utils';
import './styles.less';

const QualityMetrics = ({selectedBrands}) => {
    const history = useHistory();
    const {search} = useLocation();
    const {initialPortfolios, initialStart, initialEnd} = getQueryValues(search, selectedBrands);
    const initialDataState = {data: {}, isLoading: false, error: null};

    const [isSupportedBrand, setIsSupportedBrand] = useState(true);
    const [brand, setBrand] = useState(selectedBrands[0]);

    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [pendingPortfolios, setPendingPortfolios] = useState(initialPortfolios);
    const [selectedPortfolios, setSelectedPortfolios] = useState(initialPortfolios);
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    const [ticketsData, setTicketsData] = useState(initialDataState);
    const [tdData, setTdData] = useState(initialDataState);
    const [ttrData, setTtrData] = useState(initialDataState);
    const [cvrData, setCvrData] = useState(initialDataState);
    const [pieData, setPieData] = useState(initialDataState);
    const [openDefectsData, setOpenDefectsData] = useState(initialDataState);
    const [slaDefectsData, setSlaDefectsData] = useState(initialDataState);

    useEffect(() => {
        setBrand(selectedBrands[0]);
        setIsSupportedBrand([HOTELS_COM_BRAND, VRBO_BRAND].includes(selectedBrands[0]));
    }, [selectedBrands]);

    useEffect(() => {
        const brandPortfolios = filterBrandPortfolios(selectedPortfolios, brand);
        history.push(getQueryString(brand, selectedPortfolios, start, end));
        if (!isSupportedBrand || !brandPortfolios.length) {
            return;
        }
        const loadingDataState = {data: {}, isLoading: false, error: null};
        const fetchData = async (panel) => fetchPanelData(start, end, brandPortfolios, brand, panel);
        setTicketsData(loadingDataState);
        setTdData(loadingDataState);
        fetchData().then(setTicketsData);
        fetchData('twoDimensionalStatistics').then(setTdData);
        if (brand === HOTELS_COM_BRAND) {
            setTtrData(loadingDataState);
            setCvrData(loadingDataState);
            setPieData(loadingDataState);
            fetchData('ttrSummary').then(setTtrData);
            fetchData('createdVsResolved').then(setCvrData);
            fetchData('piecharts').then(setPieData);
        } else if (brand === VRBO_BRAND) {
            setOpenDefectsData(loadingDataState);
            setSlaDefectsData(loadingDataState);
            fetchData('opendefects').then(setOpenDefectsData);
            fetchData('opendefectspastsla').then(setSlaDefectsData);
        }
    }, [history, isSupportedBrand, brand, selectedPortfolios, start, end]);

    const handleDatetimeChange = ({start: startDateTimeStr, end: endDateTimeStr}) => {
        setPendingStart(moment(startDateTimeStr));
        setPendingEnd(moment(endDateTimeStr));
        setIsDirtyForm(true);
    };

    const handlePortfoliosChange = (portfolio) => {
        let portfolios = [];
        try {
            portfolios = JSON.parse(JSON.stringify(pendingPortfolios));
        } catch (e) {
            setTicketsData({data: {}, isLoading: false, error: 'An error occurred when parsing portfolios.'});
        }
        const idx = portfolios.map((p) => p.value).indexOf(portfolio.value);
        if (idx >= 0) {
            portfolios.splice(idx, 1);
        } else {
            portfolios.push(portfolio);
        }
        setPendingPortfolios(portfolios);
        setIsDirtyForm(true);
    };

    const handleApplyFilters = () => {
        setStart(pendingStart);
        setEnd(pendingEnd);
        if (pendingPortfolios.length) {
            setSelectedPortfolios(JSON.parse(JSON.stringify(pendingPortfolios)));
        } else {
            setPendingPortfolios([]);
            setSelectedPortfolios([]);
        }
        setIsDirtyForm(false);
    };

    const renderPortfolioCheckbox = (portfolio) => (
        <Checkbox
            key={`checkbox-${portfolio.value}`}
            size="sm"
            className="portfolio-checkbox"
            name={portfolio.text}
            label={portfolio.text}
            checked={!!pendingPortfolios.find((p) => p.value === portfolio.value)}
            onChange={() => handlePortfoliosChange(portfolio)}
        />
    );

    const renderForm = () => (
        <div className="search-form">
            <div className="form-left">
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
                    {getBrandPortfolios(brand).map(renderPortfolioCheckbox)}
                </div>
            </div>
            <div className="form-right">
                <div className="info-container">
                    <div className="info-title">
                        <SVGIcon className="info-icon" markup={QUESTION__16} />
                        {'Data source'}
                    </div>
                    <div className="info-box">
                        <div className="info-stat__label">{'JIRA Projects included:'}</div>
                        <div className="info-stat__value">
                            {selectedPortfolios
                                .reduce((acc, curr) => acc.concat(curr.projects), [])
                                .join(', ') || 'None'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderHcomPanels = () => (
        <>
            <TwoDimensionalPanel
                title="Open Bugs By Portfolio"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' by portfolio"
                tickets={ticketsData.data}
                panelData={tdData}
                portfolios={selectedPortfolios}
                dataKey="openBugs"
                groupBy="Portfolio"
                brand={brand}
            />
            <TwoDimensionalPanel
                title="Open Bugs"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived'"
                tickets={ticketsData.data}
                panelData={tdData}
                portfolios={selectedPortfolios}
                dataKey="openBugs"
                brand={brand}
            />
            <DurationPanel
                title="Mean Time to Resolve by Portfolio"
                info="Mean time to resolve in days by portfolio"
                tickets={ticketsData.data}
                panelData={ttrData}
                portfolios={selectedPortfolios}
            />
            {[P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL, P5_LABEL].map((priority) => (
                <CreatedVsResolvedPanel
                    key={`${priority} Created vs. Resolved Chart`}
                    title={`${priority} Created vs. Resolved Chart`}
                    info={`Charting ${priority} defects by their open date and resolve date (bucketed by week). Click line point for more details.`}
                    priority={priority}
                    tickets={ticketsData.data}
                    panelData={cvrData}
                />
            ))}
            <PiePanel
                title="Open Bugs (w.r.t. Priority)"
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
                title="Open Defects"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' by portfolio"
                tickets={ticketsData.data}
                panelData={openDefectsData}
                portfolios={selectedPortfolios}
                dataKey="openDefects"
            />
            <BarChartPanel
                title="Open Defects Past SLA"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' by portfolio"
                tickets={ticketsData.data}
                panelData={slaDefectsData}
                portfolios={selectedPortfolios}
                dataKey="openDefectsPastSla"
            />
            <TwoDimensionalPanel
                title="Open Bugs By Portfolio"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived' by portfolio"
                tickets={ticketsData.data}
                panelData={tdData}
                portfolios={selectedPortfolios}
                dataKey="openBugs"
                groupBy="Portfolio"
                brand={brand}
            />
            <TwoDimensionalPanel
                title="Open Bugs"
                info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived'"
                tickets={ticketsData.data}
                panelData={tdData}
                portfolios={selectedPortfolios}
                dataKey="openBugs"
                brand={brand}
            />
        </>
    );

    const renderBody = () => (
        <>
            {renderForm()}
            {!filterBrandPortfolios(selectedPortfolios, brand)?.length
                ? <div className="no-results">{'No Portfolio Selected'}</div>
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
