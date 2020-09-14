import React, {useState, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'query-string';
import {SVGIcon} from '@homeaway/react-svg';
import {QUESTION__16} from '@homeaway/svg-defs';
import {Checkbox} from '@homeaway/react-form-components';
import LoadingContainer from '../../components/LoadingContainer';
import HelpText from '../../components/HelpText/HelpText';
import {
    BarChartPanel,
    TwoDimensionalPanel,
    MTTRPanel,
    SLADefinitions,
    CreatedVsResolvedPanel,
    WoWPanel,
    PiePanel
} from './Panels';
import {PORTFOLIOS, P1_LABEL, P2_LABEL} from './constants';
import {getBrand} from '../utils';
import {getPanelDataUrl, formatBarChartData, getTicketIds} from './utils';
import './styles.less';

const getPortfolioBrand = (selectedBrands) => {
    const selectedBrand = getBrand(selectedBrands[0], 'label');
    return selectedBrand && selectedBrand.portfolioBrand
        ? selectedBrand.portfolioBrand
        : 'HCOM';
};

const QualityMetrics = ({selectedBrands}) => {
    const history = useHistory();
    const {search} = useLocation();

    // Query params
    const {portfolios: qsPortfolios} = qs.parse(search);
    const initialPortfolios = (Array.isArray(qsPortfolios) ? qsPortfolios : [qsPortfolios])
        .map((portfolio) => PORTFOLIOS.find((p) => p.value === portfolio))
        .filter((portfolio) => !!portfolio);


    const [isSupportedBrand, setIsSupportedBrand] = useState(true);
    const [portfolioBrand, setPortfolioBrand] = useState(getPortfolioBrand(selectedBrands));
    const [pendingPortfolios, setPendingPortfolios] = useState(initialPortfolios);
    const [selectedPortfolios, setSelectedPortfolios] = useState(initialPortfolios);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [tickets, setTickets] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const [tdData, setTdData] = useState({});
    const [isTdDataLoading, setIsTdDataLoading] = useState(true);
    const [tdDataError, setTdDataError] = useState();

    const [cvrData, setCvrData] = useState({});
    const [isCvrDataLoading, setIsCvrDataLoading] = useState(true);
    const [cvrDataError, setCvrDataError] = useState();

    const [openDefectTicketIds, setOpenDefectTicketIds] = useState([]);
    const [openDefectsData, setOpenDefectsData] = useState({});
    const [isOpenDefectsDataLoading, setIsOpenDefectsDataLoading] = useState(true);
    const [openDefectsError, setOpenDefectsError] = useState();

    useEffect(() => {
        const fetchData = () => {
            setPortfolioBrand(getPortfolioBrand(selectedBrands));
            setIsSupportedBrand(portfolioBrand === 'HCOM');
            if (!selectedPortfolios.length || portfolioBrand !== 'HCOM') {
                return;
            }
            setIsLoading(true);
            const brandQuery = `?selectedBrand=${selectedBrands[0]}`;
            const query = selectedPortfolios.length
                ? `${brandQuery}&portfolios=${selectedPortfolios.map((p) => p.value).join('&portfolios=')}`
                : brandQuery;
            history.push(`/quality-metrics${query}`);
            fetch(getPanelDataUrl(selectedPortfolios, portfolioBrand))
                .then((data) => data.json())
                .then((allTickets) => {
                    setTickets(allTickets);
                    setIsLoading(false);
                })
                .catch((e) => {
                    setError(e.message);
                    setIsLoading(false);
                });
            fetch(getPanelDataUrl(selectedPortfolios, portfolioBrand, 'twoDimensionalStatistics'))
                .then((data) => data.json())
                .then((response) => {
                    setTdData(response.data || {});
                    setIsTdDataLoading(false);
                })
                .catch((e) => {
                    setTdDataError(e.message);
                    setIsTdDataLoading(false);
                });
            fetch(getPanelDataUrl(selectedPortfolios, portfolioBrand, 'createdVsResolved'))
                .then((data) => data.json())
                .then((response) => {
                    setCvrData(response.data || {});
                    setIsCvrDataLoading(false);
                })
                .catch((e) => {
                    setCvrDataError(e.message);
                    setIsCvrDataLoading(false);
                });
            fetch(getPanelDataUrl(selectedPortfolios, portfolioBrand, 'opendefects'))
                .then((data) => data.json())
                .then((response) => {
                    setOpenDefectsData(response.data.openDefects || {});
                    setOpenDefectTicketIds(getTicketIds(response.data.openDefects));
                    setIsOpenDefectsDataLoading(false);
                })
                .catch((e) => {
                    setOpenDefectsError(e.message);
                    setIsOpenDefectsDataLoading(false);
                });
        };
        fetchData();
    }, [history, portfolioBrand, selectedBrands, selectedPortfolios]);

    const handlePortfoliosChange = (portfolio) => {
        let portfolios = [];
        try {
            portfolios = JSON.parse(JSON.stringify(pendingPortfolios));
        } catch (e) {
            setError('An error occurred when parsing portfolios.');
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
        if (pendingPortfolios.length) {
            setIsDirtyForm(false);
            setSelectedPortfolios(JSON.parse(JSON.stringify(pendingPortfolios)));
        } else {
            setIsDirtyForm(false);
            setPendingPortfolios([]);
            setSelectedPortfolios([]);
        }
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
            <div className="checkboxes-container">
                {PORTFOLIOS.map(renderPortfolioCheckbox)}
            </div>
            <div className="actions-container">
                <button
                    className="btn btn-primary apply-btn"
                    type="button"
                    onClick={handleApplyFilters}
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
            </div>
            <div className="info-container">
                <div className="info-title">
                    <SVGIcon className="info-icon" markup={QUESTION__16} />
                    {'Data source'}
                </div>
                <div className="info-box">
                    <div className="info-stat">
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

    const renderPanels = () => (
        <div className="panels-container">
            <LoadingContainer isLoading={isLoading} error={error}>
                <BarChartPanel
                    title="Open Defects Past SLA"
                    info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived'. See panel below for SLA definitions. Click bar chart to see corresponding defects."
                    tickets={tickets}
                    dataUrl={getPanelDataUrl(selectedPortfolios, portfolioBrand, 'opendefectspastsla')}
                    dataKey="openDefectsPastSla"
                />
                <BarChartPanel
                    title="Open Defects"
                    info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived'. Click bar chart to see corresponding defects."
                    tickets={tickets}
                    data={formatBarChartData(openDefectsData)}
                    isLoading={isOpenDefectsDataLoading}
                    error={openDefectsError}
                    dataKey="openDefects"
                />
                <SLADefinitions />
                <TwoDimensionalPanel
                    title="Two Dimensional Filter Statistics - Defects Past SLA"
                    info="Displaying defects past SLA (See SLA definitions in above panel)"
                    tickets={tickets}
                    data={tdData}
                    portfolios={selectedPortfolios}
                    dataKey="pastSLA"
                    isLoading={isTdDataLoading}
                    error={tdDataError}
                />
                <TwoDimensionalPanel
                    title="Two Dimensional Filter Statistics - Defects Approaching SLA"
                    info="Displaying defects approaching SLA (See SLA definitions in above panel)"
                    tickets={tickets}
                    data={tdData}
                    portfolios={selectedPortfolios}
                    dataKey="approachingSLA"
                    isLoading={isTdDataLoading}
                    error={tdDataError}
                />
                <TwoDimensionalPanel
                    title="Two Dimensional Filter Statistics - Open Bugs"
                    info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived'"
                    tickets={tickets}
                    data={tdData}
                    portfolios={selectedPortfolios}
                    dataKey="openBugs"
                    isLoading={isTdDataLoading}
                    error={tdDataError}
                />
                <TwoDimensionalPanel
                    title="Two Dimensional Filter Statistics - Bugs needing triage"
                    info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', 'In Production', or 'Archived'"
                    tickets={tickets}
                    data={tdData}
                    portfolios={selectedPortfolios}
                    dataKey="bugsNeedingTriage"
                    isLoading={isTdDataLoading}
                    error={tdDataError}
                />
                <MTTRPanel
                    tickets={tickets}
                    dataUrl={getPanelDataUrl(selectedPortfolios, portfolioBrand, 'timetoresolve')}
                />
                <CreatedVsResolvedPanel
                    title="Created vs. Resolved Chart - All P1s and P2s"
                    info="Charting P1 and P2 priority defects by their open date and resolve date (bucketed by week). Click line point for more details."
                    tickets={tickets}
                    data={cvrData}
                    isLoading={isCvrDataLoading}
                    error={cvrDataError}
                    priorities={[P1_LABEL, P2_LABEL]}
                />
                <CreatedVsResolvedPanel
                    title="Created vs. Resolved Chart - All Bugs"
                    info="Charting all defects by their open date and resolve date (bucketed by week). Click line point for more details."
                    tickets={tickets}
                    data={cvrData}
                    isLoading={isCvrDataLoading}
                    error={cvrDataError}
                />
                <WoWPanel
                    tickets={tickets}
                    dataUrl={getPanelDataUrl(selectedPortfolios, portfolioBrand, 'issueswowdata')}
                />
                <PiePanel
                    title="Open Bugs (w.r.t. Priority)"
                    info="Charting all defects with regard to priority. Click pie slice for more details."
                    groupBy="Priority"
                    tickets={tickets}
                    openDefectTicketIds={openDefectTicketIds}
                />
                <PiePanel
                    title="Open Bugs (w.r.t. Project)"
                    info="Charting all defects with regard to project. Click pie slices for more details."
                    groupBy="Project"
                    tickets={tickets}
                    openDefectTicketIds={openDefectTicketIds}
                />
            </LoadingContainer>
        </div>
    );

    const renderBody = () => (
        <>
            {renderForm()}
            {selectedPortfolios && selectedPortfolios.length
                ? renderPanels()
                : <div className="no-results">{'No Portfolio Selected'}</div>}
        </>
    );

    return (
        <div className="qm-container">
            <h1 className="page-title">
                {'Quality Metrics'}
                <HelpText className="page-info" text="Quality metrics of defects within the last 180 days." />
            </h1>
            {isSupportedBrand
                ? renderBody()
                : <div className="messaged">{`Quality Metrics for ${selectedBrands} is not yet available.
                    The following brands are supported at this time: "Hotels.com Retail".
                    If you have any questions, please ping #dpi-reo-opex-all or leave a comment via our Feedback form.`}</div>
            }
        </div>
    );
};

export default QualityMetrics;
