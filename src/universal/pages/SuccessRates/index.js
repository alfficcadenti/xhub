/* eslint-disable complexity */
import React, {useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import moment from 'moment';
import Select from 'react-select';
import TravelerMetricsWidget from '../../components/TravelerMetricsWidget';
import LoadingContainer from '../../components/LoadingContainer';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import RealTimeSummaryPanel from '../../components/RealTimeSummaryPanel';
import {useQueryParamChange, useSelectedBrand, useZoomAndSynced} from '../hooks';
import {
    LOB_LIST,
    EG_BRAND,
    EGENCIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND
} from '../../constants';
import {mapBrandNames, checkResponse, getBrand, makeSuccessRatesObjects} from '../utils';
import HelpText from '../../components/HelpText/HelpText';
import {SUCCESS_RATES_PAGES_LIST, METRIC_NAMES} from './constants';
import {
    getQueryParams,
    getPresets,
    getWidgetXAxisTickGap,
    shouldShowTooltip
} from './utils';
import './styles.less';


const SuccessRates = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const history = useHistory();
    const {search, pathname} = useLocation();
    const {initialStart, initialEnd, initialTimeRange, initialLobs} = getQueryParams(search);

    const [realTimeTotals, setRealTimeTotals] = useState({});
    const [isRttLoading, setIsRttLoading] = useState(true);
    const [rttError, setRttError] = useState('');

    const [widgets, setWidgets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingStart, setPendingStart] = useState(initialStart);
    const [pendingEnd, setPendingEnd] = useState(initialEnd);
    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);
    const [pendingLobs, setPendingLobs] = useState(initialLobs);
    const [selectedLobs, setSelectedLobs] = useState(initialLobs);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [currentTimeRange, setCurrentTimeRange] = useState(initialTimeRange);
    const [pendingTimeRange, setPendingTimeRange] = useState(initialTimeRange);
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const [isSupportedBrand, setIsSupportedBrand] = useState(false);
    const [isZoomedIn, setIsZoomedIn] = useState(false);

    useQueryParamChange(selectedBrands[0], onBrandChange);
    useSelectedBrand(selectedBrands[0], onBrandChange, prevSelectedBrand);

    const {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        chartLeft,
        chartRight,
        refAreaLeft,
        refAreaRight
    } = useZoomAndSynced(
        widgets,
        setWidgets,
        setPendingStart,
        setPendingEnd,
        setCurrentTimeRange,
        setStart,
        setEnd,
        setIsDirtyForm,
        pendingTimeRange,
        setIsZoomedIn
    );

    const rttRef = useRef();

    const fetchRealTimeData = ([selectedBrand]) => {
        setIsRttLoading(true);
        setRttError('');
        const now = moment();
        const rttStart = moment(now).subtract(11, 'minute').startOf('minute');
        const rttEnd = moment(now).subtract(1, 'minute').startOf('minute');
        const dateQuery = `&startDate=${rttStart.utc().format()}&endDate=${rttEnd.utc().format()}`;
        const {funnelBrand} = getBrand(selectedBrand, 'label');

        Promise.all(METRIC_NAMES.map((metricName) => fetch(`/user-events-api/v1/funnelView?brand=${funnelBrand}&metricName=${metricName}${dateQuery}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then((fetchedSuccessRates) => {
                const nextRealTimeTotals = SUCCESS_RATES_PAGES_LIST.reduce((acc, label) => {
                    acc[label] = 0;
                    return acc;
                }, {});

                SUCCESS_RATES_PAGES_LIST.forEach((label, i) => {
                    const currentSuccessRatesData = fetchedSuccessRates[i];
                    if (!currentSuccessRatesData || !currentSuccessRatesData.length) {
                        nextRealTimeTotals[label] = 'N/A';
                        return;
                    }

                    for (let counter = 1; counter <= currentSuccessRatesData.length; counter++) {
                        const {successRatePercentagesData} = currentSuccessRatesData[currentSuccessRatesData.length - counter];
                        const currentSuccessRates = successRatePercentagesData.find((item) => mapBrandNames(item.brand) === selectedBrand);

                        if (currentSuccessRates.rate !== null) {
                            nextRealTimeTotals[label] = currentSuccessRates.rate.toFixed(2);
                            break;
                        }

                        if (counter === currentSuccessRatesData.length) {
                            nextRealTimeTotals[label] = 0;
                            break;
                        }
                    }
                });

                setRealTimeTotals(nextRealTimeTotals);
            })
            .catch((err) => {
                let errorMessage = (err.message && err.message.includes('query-timeout limit exceeded'))
                    ? 'Query has timed out. Try refreshing the page. If the problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.'
                    : 'An unexpected error has occurred. Try refreshing the page. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.';
                setRttError(errorMessage);
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsRttLoading(false));
    };

    const fetchSuccessRatesData = ([selectedBrand]) => {
        const {label: pageBrand, funnelBrand} = getBrand(selectedBrand, 'label');
        setIsLoading(true);
        setError('');
        const dateQuery = start && end
            ? `&startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
            : '';
        const lobQuery = selectedLobs.length
            ? `&lineOfBusiness=${selectedLobs.map((lob) => lob.value).join(',')}`
            : '';
        Promise.all(METRIC_NAMES.map((metricName) => fetch(`/user-events-api/v1/funnelView?brand=${funnelBrand}&metricName=${metricName}${dateQuery}${lobQuery}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then((fetchedSuccessRates) => {
                if (!fetchedSuccessRates || !fetchedSuccessRates.length) {
                    setError('No data found. Try refreshing the page or select another brand.');
                    return;
                }

                const widgetObjects = makeSuccessRatesObjects(fetchedSuccessRates, start, end, pageBrand, selectedBrand, selectedLobs);
                setWidgets(widgetObjects);
            })
            .catch((err) => {
                let errorMessage = (err.message && err.message.includes('query-timeout limit exceeded'))
                    ? 'Query has timed out. Try refreshing the page. If the problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.'
                    : 'An unexpected error has occurred. Try refreshing the page. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.';
                setError(errorMessage);
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if ([EG_BRAND, EGENCIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND, HOTELS_COM_BRAND].includes(selectedBrands[0])) {
            setIsSupportedBrand(false);
            setError(`Success rates for ${selectedBrands} is not yet available.
                If you have any questions, please ping #dpi-reo-opex-all or leave a comment via our Feedback form.`);
            setIsFormDisabled(true);
        } else {
            setIsSupportedBrand(true);
            setError(null);
            setIsFormDisabled(false);
            fetchRealTimeData(selectedBrands);
            rttRef.current = setInterval(fetchRealTimeData.bind(null, selectedBrands), 60000); // refresh every minute
            history.push(`${pathname}?selectedBrand=${selectedBrands[0]}`
                + `&start=${pendingStart.format()}`
                + `&end=${pendingEnd.format()}`
                + `&lobs=${pendingLobs.map((l) => l.value).join(',')}`
            );
            if (!isZoomedIn) {
                fetchSuccessRatesData(selectedBrands);
            }
        }
        return function cleanup() {
            clearInterval(rttRef.current);
            setIsZoomedIn(false);
        };
    }, [selectedBrands, start, end, selectedLobs]);

    const handleDatetimeChange = ({start: startDateTimeStr, end: endDateTimeStr}, text) => {
        setPendingTimeRange(text || pendingTimeRange);
        setPendingStart(moment(startDateTimeStr));
        setPendingEnd(moment(endDateTimeStr));
        setIsDirtyForm(true);
    };

    const handleApplyFilters = () => {
        setCurrentTimeRange(pendingTimeRange);
        setStart(pendingStart);
        setEnd(pendingEnd);
        setSelectedLobs(pendingLobs);
        setIsDirtyForm(false);
    };

    const handleLoBsChange = (lobs) => {
        setPendingLobs(lobs || []);
        setIsDirtyForm(true);
    };

    const renderWidget = ({pageName, aggregatedData, pageBrand, minValue}) => (
        <TravelerMetricsWidget
            title={pageName}
            data={aggregatedData}
            key={pageName}
            brand={pageBrand}
            tickGap={getWidgetXAxisTickGap(currentTimeRange)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            chartLeft={chartLeft}
            chartRight={chartRight}
            refAreaLeft={refAreaLeft}
            refAreaRight={refAreaRight}
            helpText={shouldShowTooltip(pageName, pageBrand, selectedLobs)}
            formatYAxis={(value) => `${value.toFixed()}%`}
            minChartValue={minValue}
            maxChartValue={100}
            selectedLoB={pageName !== SUCCESS_RATES_PAGES_LIST[0] ? selectedLobs : []}
            stacked
        />
    );

    return (
        <div className="success-rates-container">
            <h1>
                {'Success Rates'}
                <HelpText text="Only for LOB Hotels" placement="top" />
            </h1>
            <div className="form-container">
                <DatetimeRangePicker
                    onChange={handleDatetimeChange}
                    startDate={pendingStart.toDate()}
                    endDate={pendingEnd.toDate()}
                    presets={getPresets()}
                    disabled={isFormDisabled}
                />
                <Select
                    isMulti
                    classNamePrefix="lob-select"
                    className="lob-select-container"
                    value={pendingLobs}
                    options={LOB_LIST.filter(({value}) => ['H', 'C'].includes(value))}
                    onChange={handleLoBsChange}
                    placeholder={'Select Line of Business'}
                />
                <button
                    className="btn btn-primary apply-btn"
                    type="button"
                    onClick={handleApplyFilters}
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
            </div>
            {isSupportedBrand && (
                <RealTimeSummaryPanel
                    realTimeTotals={realTimeTotals}
                    isRttLoading={isRttLoading}
                    rttError={rttError}
                    tooltipLabel={'Latest real time success rate. Refreshes every minute.'}
                    label={'Real Time Success Rates'}
                    showPercentageSign
                />
            )}
            <LoadingContainer isLoading={isLoading} error={error} className="success-rates-loading-container">
                <div className="success-rates-widget-container">
                    {widgets.map(renderWidget)}
                </div>
            </LoadingContainer>
        </div>
    );
};

export default SuccessRates;
