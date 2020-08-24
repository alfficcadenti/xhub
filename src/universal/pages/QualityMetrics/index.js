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
    UnresolvedCountsPanel,
    WoWPanel,
    PiePanel
} from './Panels';
import {PORTFOLIOS, P1_LABEL, P2_LABEL} from './constants';
import {getBrand} from '../utils';
import {getPanelDataUrl} from './utils';
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
    const portfolioBrand = getPortfolioBrand(selectedBrands);

    const isSupportedBrand = portfolioBrand === 'HCOM';

    // Query params
    const {portfolios: qsPortfolios} = qs.parse(search);
    const initialPortfolios = (Array.isArray(qsPortfolios) ? qsPortfolios : [qsPortfolios])
        .map((portfolio) => PORTFOLIOS.find((p) => p.value === portfolio))
        .filter((portfolio) => !!portfolio);

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

    const [unresolvedData, setUnresolvedData] = useState({});
    const [isUnresolvedDataLoading, setIsUnresolvedDataLoading] = useState(true);
    const [unresolvedDataError, setUnresolvedDataError] = useState();

    const fetchData = () => {
        setIsLoading(true);
        const brandQuery = `?selectedBrand=${selectedBrands}`;
        const query = pendingPortfolios.length
            ? `${brandQuery}&portfolios=${pendingPortfolios.map((p) => p.value).join('&portfolios=')}`
            : brandQuery;
        history.push(`/quality-metrics${query}`);
        fetch(getPanelDataUrl(pendingPortfolios, portfolioBrand))
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
        fetch(getPanelDataUrl(selectedPortfolios, portfolioBrand, 'unresolvedissuescount'))
            .then((data) => data.json())
            .then((response) => {
                setUnresolvedData(response.data || {});
                setIsUnresolvedDataLoading(false);
            })
            .catch((e) => {
                setUnresolvedDataError(e.message);
                setIsUnresolvedDataLoading(false);
            });
    };

    useEffect(() => {
        if (selectedPortfolios.length && isSupportedBrand) {
            fetchData();
        }
    }, []);

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
        fetchData();
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
                    <div className="info-stat">
                        <div className="info-stat__label">{'Dev Inbox Components included:'}</div>
                        <div className="info-stat__value">
                            {selectedPortfolios
                                .reduce((acc, curr) => acc.concat(curr.components), [])
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
                    tickets={tickets}
                    dataUrl={getPanelDataUrl(selectedPortfolios, portfolioBrand, 'opendefectspastsla')}
                    dataKey="openDefectsPastSla"
                />
                <BarChartPanel
                    title="Open Defects"
                    tickets={tickets}
                    dataUrl={getPanelDataUrl(selectedPortfolios, portfolioBrand, 'opendefects')}
                    dataKey="openDefects"
                />
                <SLADefinitions />
                <TwoDimensionalPanel
                    title="Two Dimensional Filter Statistics - Defects Past SLA"
                    tickets={tickets}
                    data={tdData}
                    portfolios={selectedPortfolios}
                    dataKey="pastSLA"
                    isLoading={isTdDataLoading}
                    error={tdDataError}
                    isFixedHeight
                />
                <TwoDimensionalPanel
                    title="Two Dimensional Filter Statistics - Defects Approaching SLA"
                    tickets={tickets}
                    data={tdData}
                    portfolios={selectedPortfolios}
                    dataKey="approachingSLA"
                    isLoading={isTdDataLoading}
                    error={tdDataError}
                    isFixedHeight
                />
                <TwoDimensionalPanel
                    title="Two Dimensional Filter Statistics - Open Bugs"
                    tickets={tickets}
                    data={tdData}
                    portfolios={selectedPortfolios}
                    dataKey="openBugs"
                    isLoading={isTdDataLoading}
                    error={tdDataError}
                    isFixedHeight
                />
                <TwoDimensionalPanel
                    title="Two Dimensional Filter Statistics - Open Bugs with Salesforce Cases"
                    tickets={tickets}
                    data={tdData}
                    portfolios={selectedPortfolios}
                    dataKey="openBugsWithSalesforceCases"
                    isLoading={isTdDataLoading}
                    error={tdDataError}
                    isFixedHeight
                />
                <TwoDimensionalPanel
                    title="Two Dimensional Filter Statistics - Bugs needing triage"
                    tickets={tickets}
                    data={tdData}
                    portfolios={selectedPortfolios}
                    dataKey="bugsNeedingTriage"
                    isLoading={isTdDataLoading}
                    error={tdDataError}
                    fullWidth
                />
                <MTTRPanel
                    tickets={tickets}
                    dataUrl={getPanelDataUrl(selectedPortfolios, portfolioBrand, 'timetoresolve')}
                />
                <CreatedVsResolvedPanel
                    title="Created vs. Resolved Chart - All P1s and P2s"
                    tickets={tickets}
                    data={cvrData}
                    isLoading={isCvrDataLoading}
                    error={cvrDataError}
                    priorities={[P1_LABEL, P2_LABEL]}
                />
                <CreatedVsResolvedPanel
                    title="Created vs. Resolved Chart - All Bugs"
                    tickets={tickets}
                    data={cvrData}
                    isLoading={isCvrDataLoading}
                    error={cvrDataError}
                />
                <UnresolvedCountsPanel
                    title="Unresolved Trend Line - All P1s and P2s"
                    tickets={tickets}
                    data={unresolvedData}
                    isLoading={isUnresolvedDataLoading}
                    error={unresolvedDataError}
                    dataKey="unResolvedP1AndP2IssuesByWeek"
                />
                <UnresolvedCountsPanel
                    title="Unresolved Trend Line - All Bugs"
                    tickets={tickets}
                    data={unresolvedData}
                    isLoading={isUnresolvedDataLoading}
                    error={unresolvedDataError}
                    dataKey="unResolvedIssuesByWeek"
                />
                <WoWPanel
                    tickets={tickets}
                    dataUrl={getPanelDataUrl(selectedPortfolios, portfolioBrand, 'issueswowdata')}
                />
                <PiePanel
                    title="Open Bugs (w.r.t. Priority)"
                    groupBy="Priority"
                    tickets={tickets}
                />
                <PiePanel
                    title="Open Bugs (w.r.t. Project)"
                    groupBy="Project"
                    tickets={tickets}
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
                    The following brands are supported at this time: "Hotels.com".
                    If you have any questions, please ping #dpi-reo-opex-all or leave a comment via our Feedback form.`}</div>
            }
        </div>
    );
};

export default QualityMetrics;
