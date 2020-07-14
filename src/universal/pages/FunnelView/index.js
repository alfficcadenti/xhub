import React, {useEffect, useState} from 'react';
import moment from 'moment';
import 'moment-timezone';
import PageviewWidget from '../../components/PageviewWidget';
import LoadingContainer from '../../components/LoadingContainer';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import {getBrand, EG_BRAND} from '../../constants';
import {useSelectedBrand} from '../hooks';
import './styles.less';

const TIMEZONE_OFFSET = (new Date()).getTimezoneOffset();
const TIMEZONE_ABBR = moment.tz.zone(moment.tz.guess()).abbr(TIMEZONE_OFFSET);

const FunnelView = ({selectedBrands}) => {
    const [widgets, setWidgets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingStart, setPendingStart] = useState(moment().subtract(24, 'hours').startOf('minute'));
    const [pendingEnd, setPendingEnd] = useState(moment().endOf('minute'));
    const [start, setStart] = useState(moment().subtract(24, 'hours').startOf('minute'));
    const [end, setEnd] = useState(moment().endOf('minute'));
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [currentTimeRange, setCurrentTimeRange] = useState('Last 24 hours');
    const [pendingTimeRange, setPendingTimeRange] = useState('Last 24 hours');
    useSelectedBrand(selectedBrands[0]);

    // Shared chart states
    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');
    const [chartLeft, setChartLeft] = useState('dataMin');
    const [chartRight, setChartRight] = useState('dataMax');

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

    const fetchData = ([selectedBrand]) => {
        const {label: pageBrand, funnelBrand} = getBrand(selectedBrand);
        setIsLoading(true);
        setError('');
        const dateQuery = start && end
            ? `&startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
            : '';
        fetch(`/v1/pageViews?brand=${funnelBrand}&timeInterval=1${dateQuery}`)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error();
                }
                return resp.json();
            })
            .then((fetchedPageviews) => {
                const widgetObjects = PAGES_LIST.map(({name, label}) => {
                    const pageViews = fetchedPageviews && fetchedPageviews
                        .map(({time, pageViewsData}) => {
                            const currentPageViews = pageViewsData.find((item) => item.page === name);
                            const momentTime = moment(time);
                            return currentPageViews
                                ? {
                                    label: `${momentTime.format('YYYY-MM-DD HH:mm')} ${TIMEZONE_ABBR}`,
                                    time: momentTime.format('YYYY-MM-DD HH:mm'),
                                    momentTime,
                                    value: currentPageViews.views
                                }
                                : {};
                        })
                        .filter(({momentTime}) => momentTime.isBetween(start, end, 'minutes', '[]'));
                    return {pageName: label, pageViews, pageBrand};
                });
                setWidgets(widgetObjects);
            })
            .catch((err) => {
                const errorMessage = pageBrand === EG_BRAND
                    ? 'Aggregated view is not supported. Please select an individual brand.'
                    : 'No data found. Try refreshing the page or select another brand.';
                setError(errorMessage);
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData(selectedBrands);
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
            <DatetimeRangePicker
                onChange={handleDatetimeChange}
                startDate={pendingStart.toDate()}
                endDate={pendingEnd.toDate()}
                presets={getPresets()}
            />
            <button
                className="btn btn-primary apply-btn"
                type="button"
                onClick={handleApplyFilters}
                disabled={!isDirtyForm}
            >
                {'Apply'}
            </button>
            <LoadingContainer isLoading={isLoading} error={error} className="page-views-loading-container">
                <div className="page-views-widget-container">
                    {widgets.map(renderWidget)}
                </div>
            </LoadingContainer>
        </div>
    );
};

export default FunnelView;
