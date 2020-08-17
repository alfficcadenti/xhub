import React, {useState, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'query-string';
import {SVGIcon} from '@homeaway/react-svg';
import {QUESTION__16} from '@homeaway/svg-defs';
import {Checkbox} from '@homeaway/react-form-components';
import LoadingContainer from '../../components/LoadingContainer';
import HelpText from '../../components/HelpText/HelpText';
import OpenDefects from './Panels/OpenDefects';
import OpenDefectsPastSLA from './Panels/OpenDefectsPastSLA';
import SLADefinitions from './Panels/SLADefinitions';
import {PORTFOLIOS} from './constants';
import {getBrand} from '../utils';
import {getPanelDataUrl, formatTickets} from './utils';
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

    const fetchData = () => {
        setIsLoading(true);
        const query = pendingPortfolios.length
            ? `?portfolios=${pendingPortfolios.map((p) => p.value).join('&portfolios=')}`
            : '';
        history.push(`/quality-metrics${query}`);
        fetch(getPanelDataUrl(pendingPortfolios))
            .then((data) => data.json())
            .then((allTickets) => {
                const formattedTickets = formatTickets(allTickets);
                setTickets(formattedTickets);
                setIsLoading(false);
            })
            .catch((e) => {
                setError(e.message);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (selectedPortfolios.length) {
            fetchData();
        }
    }, []);

    const handlePortfoliosChange = (portfolio) => {
        const portfolios = JSON.parse(JSON.stringify(pendingPortfolios));
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
                <OpenDefectsPastSLA portfolios={selectedPortfolios} tickets={tickets} brand={portfolioBrand} />
                <OpenDefects portfolios={selectedPortfolios} tickets={tickets} brand={portfolioBrand} />
                <SLADefinitions />
            </LoadingContainer>
        </div>
    );

    return (
        <div className="qm-container">
            <h1 className="page-title">
                {'Quality Metrics'}
                <HelpText className="page-info" text="Quality metrics of defects within the last 180 days." />
            </h1>
            {renderForm()}
            {selectedPortfolios && selectedPortfolios.length
                ? renderPanels()
                : <div className="no-results">{'No Portfolio Selected'}</div>}
        </div>
    );
};

export default QualityMetrics;
