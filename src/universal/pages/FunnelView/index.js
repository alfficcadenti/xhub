import React, {useEffect, useState, useRef} from 'react';
import moment from 'moment';
import 'moment-timezone';
import PageviewWidget from '../../components/PageviewWidget';
import LoadingContainer from '../../components/LoadingContainer';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import RealTimeSummaryPanel from '../../components/RealTimeSummaryPanel';
import {useQueryParamChange, useSelectedBrand} from '../hooks';
import {getBrand, EG_BRAND, EGENCIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND} from '../../constants';
import {checkResponse} from '../utils';
import './styles.less';

const TIMEZONE_OFFSET = (new Date()).getTimezoneOffset();
const TIMEZONE_ABBR = moment.tz.zone(moment.tz.guess()).abbr(TIMEZONE_OFFSET);

const FunnelView = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
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

    // Shared chart states
    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');
    const [chartLeft, setChartLeft] = useState('dataMin');
    const [chartRight, setChartRight] = useState('dataMax');

    const rttRef = useRef();

    const PAGES_LIST = [
        {name: 'home', label: 'Home'},
        {name: 'searchresults', label: 'Search'},
        {name: 'property', label: 'Property'},
        {name: 'bookingform', label: 'Booking Form'},
        {name: 'bookingconfirmation', label: 'Booking Confirmation'},
    ];
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
        const {funnelBrand} = getBrand(selectedBrand);
        setIsRttLoading(true);
        setRttError('');
        const now = moment();
        const rttStart = moment(now).subtract(2, 'minute').startOf('minute');
        const rttEnd = moment(now).subtract(1, 'minute').startOf('minute');
        const dateQuery = `&startDate=${rttStart.utc().format()}&endDate=${rttEnd.utc().format()}`;
        fetch(`/v1/pageViews?brand=${funnelBrand}&timeInterval=1${dateQuery}`)
            .then(checkResponse)
            .then((fetchedPageviews) => {
                const nextRealTimeTotals = PAGES_LIST.reduce((acc, {label}) => {
                    acc[label] = 0;
                    return acc;
                }, {});
                PAGES_LIST.forEach(({name, label}) => {
                    fetchedPageviews.forEach(({time, pageViewsData}) => {
                        const currentPageViews = pageViewsData.find((item) => item.page === name);
                        if (currentPageViews) {
                            const momentTime = moment(time);
                            if (momentTime.isBetween(rttStart, rttEnd, 'minute', '(]')) {
                                nextRealTimeTotals[label] += currentPageViews.views;
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

    const fetchPageViewsData = ([selectedBrand]) => {
        const {label: pageBrand, funnelBrand} = getBrand(selectedBrand);
        setIsLoading(true);
        setError('');
        const dateQuery = start && end
            ? `&startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
            : '';
        fetch(`/v1/pageViews?brand=${funnelBrand}&timeInterval=1${dateQuery}`)
            .then(checkResponse)
            .then((fetchedPageviews) => {
                if (!fetchedPageviews || !fetchedPageviews.length) {
                    setError('No data found. Try refreshing the page or select another brand.');
                    return;
                }
                const widgetObjects = PAGES_LIST.map(({name, label}) => {
                    const pageViews = [];
                    fetchedPageviews.forEach(({time, pageViewsData}) => {
                        const currentPageViews = pageViewsData.find((item) => item.page === name);
                        if (currentPageViews) {
                            const momentTime = moment(time);
                            if (momentTime.isBetween(start, end, 'minutes', '[]')) {
                                pageViews.push({
                                    label: `${momentTime.format('YYYY-MM-DD HH:mm')} ${TIMEZONE_ABBR}`,
                                    time: momentTime.format('YYYY-MM-DD HH:mm'),
                                    momentTime,
                                    value: currentPageViews.views
                                });
                            }
                        }
                    });
                    return {pageName: label, pageViews, pageBrand};
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
        clearInterval(rttRef.current);
        if ([EG_BRAND, EGENCIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND].includes(selectedBrands[0])) {
            setIsSupportedBrand(false);
            setError(`Page views for ${selectedBrands} is not yet available.
                The following brands are supported at this time: "Expedia", "Hotels.com", and "Vrbo".
                If you have any questions, please ping #dpi-reo-opex-all or leave a comment via our Feedback form.`);
            setIsFormDisabled(true);
        } else {
            setIsSupportedBrand(true);
            setError(null);
            setIsFormDisabled(false);
            fetchRealTimeData(selectedBrands);
            rttRef.current = setInterval(fetchRealTimeData, 60000); // refresh every minute
            fetchPageViewsData(selectedBrands);
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

    const handleMouseUp = () => {
        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            setRefAreaLeft('');
            setRefAreaRight('');
            return;
        }
        // xAxis domain
        let nextRefAreaLeft = refAreaLeft;
        let nextRefAreaRight = refAreaRight;
        if (moment(refAreaLeft).isAfter(refAreaRight)) {
            // if refArea was dragged right to left
            [nextRefAreaLeft, nextRefAreaRight] = [refAreaRight, refAreaLeft];
        }
        const fromIdx = widgets[0].pageViews.findIndex(({time}) => time === nextRefAreaLeft);
        const toIdx = widgets[0].pageViews.findIndex(({time}) => time === nextRefAreaRight);
        // slice data based on new xAxis domain
        const nextWidgets = widgets.map((w) => {
            const nextWidget = w;
            nextWidget.pageViews = w.pageViews.slice(fromIdx, toIdx);
            return nextWidget;
        });
        setRefAreaLeft('');
        setRefAreaRight('');
        setWidgets(nextWidgets.slice());
        setChartLeft(nextRefAreaLeft);
        setChartRight(nextRefAreaRight);
        setPendingStart(moment(nextRefAreaLeft));
        setPendingEnd(moment(nextRefAreaRight));
        setCurrentTimeRange(pendingTimeRange);
        setStart(moment(nextRefAreaLeft));
        setEnd(moment(nextRefAreaRight));
        setIsDirtyForm(false);
    };

    const handleMouseDown = (e) => setRefAreaLeft(e.activeLabel);
    const handleMouseMove = (e) => refAreaLeft && setRefAreaRight(e.activeLabel);

    const renderWidget = ({pageName, pageViews, pageBrand}) => (
        <PageviewWidget
            title={pageName}
            data={pageViews}
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
        />
    );

    return (
        <div className="funnel-views-container">
            <h1>{'Traveler Page Views'}</h1>
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
                label={'Real time pageview totals within the last minute. Refreshes every minute.'}
            />}
            <LoadingContainer isLoading={isLoading} error={error} className="page-views-loading-container">
                <div className="page-views-widget-container">
                    {widgets.map(renderWidget)}
                </div>
            </LoadingContainer>
        </div>
    );
};

export default FunnelView;
