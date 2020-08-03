import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import 'moment-timezone';
import PageviewWidget from '../../components/PageviewWidget';
import LoadingContainer from '../../components/LoadingContainer';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import RealTimeSummaryPanel from '../../components/RealTimeSummaryPanel';
import {useQueryParamChange, useSelectedBrand, useZoomAndSynced} from '../hooks';
import {
    EG_BRAND,
    EGENCIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND,
    EXPEDIA_BRAND
} from '../../constants';
import {mapBrandNames, checkResponse, getBrand} from '../utils';
import HelpText from '../../components/HelpText/HelpText';
import './styles.less';


const TIMEZONE_OFFSET = (new Date()).getTimezoneOffset();
const TIMEZONE_ABBR = moment.tz.zone(moment.tz.guess()).abbr(TIMEZONE_OFFSET);

const SuccessRates = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const initialStart = moment().subtract(6, 'hours').startOf('minute');
    const initialEnd = moment().endOf('minute');
    const initialTimeRange = 'Last 6 hours';

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
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [currentTimeRange, setCurrentTimeRange] = useState(initialTimeRange);
    const [pendingTimeRange, setPendingTimeRange] = useState(initialTimeRange);
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const [isSupportedBrand, setIsSupportedBrand] = useState(false);

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
        pendingTimeRange
    );

    const rttRef = useRef();

    const PAGES_LIST = [
        'Home To Search Page (SERP)',
        'Search (SERP) To Property Page (PDP)',
        'Property (PDP) To Checkout Page (CKO)',
        'Checkout (CKO) To Checkout Confirmation Page'
    ];
    const metricNames = ['SearchSuccessRate', 'SERPSuccessRate', 'PDPSuccessRate', 'checkoutSuccessRate'];

    const getNowDate = () => moment().endOf('minute').toDate();
    const getLastDate = (value, unit) => moment().subtract(value, unit).startOf('minute').toDate();
    const getValue = (value, unit) => ({start: getLastDate(value, unit), end: getNowDate()});
    const getPresets = () => [
        {text: 'Last 15 minutes', value: getValue(15, 'minutes')},
        {text: 'Last 30 minutes', value: getValue(30, 'minutes')},
        {text: 'Last 1 hour', value: getValue(1, 'hour')},
        {text: 'Last 3 hours', value: getValue(3, 'hours')},
        {text: 'Last 6 hours', value: getValue(6, 'hours')},
        {text: 'Last 12 hours', value: getValue(12, 'hours')},
        {text: 'Last 24 hours', value: getValue(24, 'hours')}
    ];

    const fetchRealTimeData = ([selectedBrand]) => {
        setIsRttLoading(true);
        setRttError('');
        const now = moment();
        const rttStart = moment(now).subtract(31, 'minute').startOf('minute');
        const rttEnd = moment(now).subtract(1, 'minute').startOf('minute');
        const dateQuery = `&startDate=${rttStart.utc().format()}&endDate=${rttEnd.utc().format()}`;

        Promise.all(metricNames.map((metricName) => fetch(`/user-events-api/v1/funnelView?metricName=${metricName}${dateQuery}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then((fetchedSuccessRates) => {
                const nextRealTimeTotals = PAGES_LIST.reduce((acc, label) => {
                    acc[label] = 0;
                    return acc;
                }, {});

                PAGES_LIST.forEach((label, i) => {
                    fetchedSuccessRates[i].forEach(({time, successRatePercentagesData}, index, arr) => {
                        const currentSuccessRates = successRatePercentagesData.find((item) => mapBrandNames(item.brand) === selectedBrand);

                        if (currentSuccessRates) {
                            nextRealTimeTotals[label] += currentSuccessRates.rate;
                            const isLastItem = (arr.length - 1 === index);

                            if (isLastItem) {
                                nextRealTimeTotals[label] = nextRealTimeTotals[label] / arr.length;
                            }
                        }
                    });
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
        const {label: pageBrand} = getBrand(selectedBrand, 'label');
        setIsLoading(true);
        setError('');
        const dateQuery = start && end
            ? `&startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
            : '';

        Promise.all(metricNames.map((metricName) => fetch(`/user-events-api/v1/funnelView?metricName=${metricName}${dateQuery}`)))
            .then((responses) => Promise.all(responses.map(checkResponse)))
            .then((fetchedSuccessRates) => {
                if (!fetchedSuccessRates || !fetchedSuccessRates.length) {
                    setError('No data found. Try refreshing the page or select another brand.');
                    return;
                }

                const widgetObjects = PAGES_LIST.map((pageName, i) => {
                    const aggregatedData = [];

                    fetchedSuccessRates[i].forEach(({time, successRatePercentagesData}) => {
                        const currentSuccessRates = successRatePercentagesData.find((item) => mapBrandNames(item.brand) === selectedBrand);

                        if (currentSuccessRates) {
                            const momentTime = moment(time);

                            if (momentTime.isBetween(start, end, 'minutes', '[]')) {
                                aggregatedData.push({
                                    label: `${momentTime.format('YYYY-MM-DD HH:mm')} ${TIMEZONE_ABBR}`,
                                    time: momentTime.format('YYYY-MM-DD HH:mm'),
                                    momentTime,
                                    value: currentSuccessRates.rate === null ? 0 : currentSuccessRates.rate
                                });
                            }
                        }
                    });

                    return {pageName, aggregatedData, pageBrand};
                });

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
            rttRef.current = setInterval(fetchRealTimeData.bind(null, selectedBrands), 60000 * 5); // refresh every minute
            fetchSuccessRatesData(selectedBrands);
        }
        return function cleanup() {
            clearInterval(rttRef.current);
        };
    }, [selectedBrands, start, end]);

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
        setIsDirtyForm(false);
    };

    const getWidgetXAxisTickGap = (timeRange) => [
        'Last 1 hour',
        'Last 3 hours',
        'Last 6 hours',
        'Last 12 hours',
        'Last 24 hours'
    ].includes(timeRange) ? 20 : 5;

    const shouldShowTooltip = (pageName, pageBrand) => pageBrand === EXPEDIA_BRAND && pageName === PAGES_LIST[PAGES_LIST.length - 1];

    const renderWidget = ({pageName, aggregatedData, pageBrand}) => (
        <PageviewWidget
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
            helpText={shouldShowTooltip(pageName, pageBrand)}
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
                <button
                    className="btn btn-primary apply-btn"
                    type="button"
                    onClick={handleApplyFilters}
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
            </div>
            {isSupportedBrand && <RealTimeSummaryPanel
                realTimeTotals={realTimeTotals}
                isRttLoading={isRttLoading}
                rttError={rttError}
                tooltipLabel={'Real time success rates average within the last 30 minutes. Refreshes every 5 minutes.'}
                label={'Real Time Success Rates'}
                showPercentageSign
            />}
            <LoadingContainer isLoading={isLoading} error={error} className="success-rates-loading-container">
                <div className="success-rates-widget-container">
                    {widgets.map(renderWidget)}
                </div>
            </LoadingContainer>
        </div>
    );
};

export default SuccessRates;
