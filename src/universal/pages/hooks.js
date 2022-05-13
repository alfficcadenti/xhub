import {useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'query-string';
import moment from 'moment';
import {getIntervalInMinutes, isMetricGroupSelected, isViewSelected} from '../pages/SuccessRates/utils';
import {EG_BRAND, EGENCIA_BRAND} from '../constants';
import {checkResponse, getAdjustedRefAreas, isInvalidRange} from './utils';
import {NATIVE_VIEW_LABEL, GRAFANA_VIEW_LABEL} from './SuccessRates/constants';

export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export const useSelectedBrand = (brand, prevBrand) => {
    const history = useHistory();
    const {pathname} = useLocation();
    useEffect(() => {
        if (brand !== prevBrand && !JSON.parse(localStorage.getItem('isQueryChanged'))) {
            history.push(`${pathname}?selectedBrand=${brand}`);
            localStorage.setItem('isBrandFilterChanged', JSON.stringify(true));
        }
    }, [brand, history, pathname, prevBrand]);
};

export const useQueryParamChange = (onBrandChange) => {
    const {search} = useLocation();
    const query = qs.parse(search);
    useEffect(() => {
        if (query.selectedBrand && !JSON.parse(localStorage.getItem('isBrandFilterChanged'))) {
            onBrandChange([query.selectedBrand]);

            localStorage.setItem('isQueryChanged', JSON.stringify(true));
            localStorage.setItem('isBrandFilterChanged', JSON.stringify(true));
        }
    }, [query.selectedBrand, onBrandChange]);
};

export const useZoomAndSynced = (
    widgets,
    setCurrentWidgets,
    setPendingStart,
    setPendingEnd,
    setCurrentTimeRange,
    setStart,
    setEnd,
    setIsDirtyForm,
    pendingTimeRange,
    setIsZoomedIn,
    setRefAreaLeft,
    setRefAreaRight,
    setChartLeft,
    setChartRight,
    refAreaLeft,
    refAreaRight,
    timeInterval
) => {
    const handleMouseUp = () => {
        if (isInvalidRange(refAreaLeft, refAreaRight)) {
            setRefAreaLeft('');
            setRefAreaRight('');
            return;
        }

        // xAxis domain
        const [nextRefAreaLeft, nextRefAreaRight] = getAdjustedRefAreas(refAreaLeft, refAreaRight);

        const fromIdx = widgets[0].aggregatedData.findIndex(({time}) => time === nextRefAreaLeft);
        const toIdx = widgets[0].aggregatedData.findIndex(({time}) => time === nextRefAreaRight);
        // slice data based on new xAxis domain
        const nextWidgets = widgets.map((w) => {
            const nextWidget = w;
            nextWidget.aggregatedData = w.aggregatedData.slice(fromIdx, toIdx);
            nextWidget.minValue = nextWidget.aggregatedData.reduce((prev, current) =>
                Math.min(prev, current.value), nextWidget.aggregatedData[0].value);
            return nextWidget;
        });
        const nextTimeInterval = getIntervalInMinutes(nextRefAreaLeft, nextRefAreaRight);
        const nextEnd = timeInterval
            ? moment(nextRefAreaRight).add(nextTimeInterval - 1, 'minutes') // do not clip data from rest of time bucket when zooming
            : moment(nextRefAreaRight);
        setRefAreaLeft('');
        setRefAreaRight('');
        setCurrentWidgets(nextWidgets.slice());
        setChartLeft(nextRefAreaLeft);
        setChartRight(nextRefAreaRight);
        setPendingStart(moment(nextRefAreaLeft));
        setPendingEnd(moment(nextEnd));
        setCurrentTimeRange(pendingTimeRange);
        setStart(moment(nextRefAreaLeft));
        setEnd(moment(nextEnd));
        setIsDirtyForm(false);
        setIsZoomedIn(true);
        if (typeof setIsZoomedIn === 'function') {
            // Trigger zoom if time interval is not passed in or is the same; otherwise trigger normal fetch
            setIsZoomedIn(!timeInterval || timeInterval === nextTimeInterval);
        }
    };

    const handleMouseDown = (e) => {
        if (e && e.activeLabel) {
            setRefAreaLeft(e.activeLabel);
        }
    };

    const handleMouseMove = (e) => {
        if (refAreaLeft && e && e.activeLabel) {
            setRefAreaRight(e.activeLabel);
        }
    };

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    };
};

export const useFetchProductMapping = (startDate, endDate, viewType, metricGroup) => {
    const [productMapping, setProductMapping] = useState([]);

    useEffect(() => {
        const fetchProductMapping = () => {
            if (viewType === NATIVE_VIEW_LABEL && isMetricGroupSelected(metricGroup)) {
                const dateQuery = startDate && endDate
                    ? `from_datetime=${moment(startDate).utc().format()}&to_datetime=${moment(endDate).utc().format()}`
                    : '';
                fetch(`/productMapping?${dateQuery}`)
                    .then(checkResponse)
                    .then((mapping) => {
                        setProductMapping(mapping);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        };

        fetchProductMapping();
    }, [startDate, endDate, viewType, metricGroup]);

    return productMapping;
};

export const useAddToUrl = (
    selectedBrands,
    viewType,
    metricGroup,
    start,
    end,
    selectedLobs,
    pendingStart,
    pendingEnd
) => {
    const history = useHistory();
    const {pathname} = useLocation();
    useEffect(() => {
        if (!isViewSelected(viewType) || !isMetricGroupSelected(metricGroup)) {
            history.push(`${pathname}?selectedBrand=${selectedBrands[0]}`);
        } else if (viewType === GRAFANA_VIEW_LABEL) {
            history.push(`${pathname}?selectedBrand=${selectedBrands[0]}`
                + `&view=${viewType}`
                + `&metric=${metricGroup}`);
        } else if (![EG_BRAND, EGENCIA_BRAND].includes(selectedBrands[0])) {
            history.push(`${pathname}?selectedBrand=${selectedBrands[0]}`
                + `&view=${viewType}`
                + `&metric=${metricGroup}`
                + `&from=${encodeURIComponent(pendingStart?.format())}`
                + `&to=${encodeURIComponent(pendingEnd?.format())}`
                + `&lobs=${selectedLobs.map((l) => l.value).join(',')}`
            );
        }
    }, [history, pathname, selectedBrands, metricGroup, viewType, start, end, selectedLobs, pendingStart, pendingEnd]);
};
