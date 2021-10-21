import {useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'query-string';
import moment from 'moment';
import {checkResponse} from './utils';
import {EG_BRAND, EGENCIA_BRAND} from '../constants';

export const usePrevious = (value) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};

export const useSelectedBrand = (selectedBrand, setSelectedBrands, prevSelectedBrand) => {
    const history = useHistory();
    const {pathname} = useLocation();

    useEffect(() => {
        if (selectedBrand !== prevSelectedBrand && !JSON.parse(localStorage.getItem('isQueryChanged'))) {
            history.push(`${pathname}?selectedBrand=${selectedBrand}`);

            localStorage.setItem('isBrandFilterChanged', JSON.stringify(true));
        }
    }, [selectedBrand]);
};

export const useQueryParamChange = (selectedBrand, setSelectedBrands) => {
    const {search} = useLocation();
    const query = qs.parse(search);

    useEffect(() => {
        if (query.selectedBrand && !JSON.parse(localStorage.getItem('isBrandFilterChanged'))) {
            setSelectedBrands([query.selectedBrand]);

            localStorage.setItem('isQueryChanged', JSON.stringify(true));
            localStorage.setItem('isBrandFilterChanged', JSON.stringify(true));
        }
    }, [query.selectedBrand]);
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
    refAreaRight
) => {
    const handleMouseUp = () => {
        const diff = refAreaRight - refAreaLeft;
        const minRangeWidth = 200000;

        if (refAreaLeft === refAreaRight || refAreaRight === '' || diff < minRangeWidth) {
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
        setRefAreaLeft('');
        setRefAreaRight('');
        setCurrentWidgets(nextWidgets.slice());
        setChartLeft(nextRefAreaLeft);
        setChartRight(nextRefAreaRight);
        setPendingStart(moment(nextRefAreaLeft));
        setPendingEnd(moment(nextRefAreaRight));
        setCurrentTimeRange(pendingTimeRange);
        setStart(moment(nextRefAreaLeft));
        setEnd(moment(nextRefAreaRight));
        setIsDirtyForm(false);
        setIsZoomedIn(true);

        if (typeof setIsZoomedIn === 'function') {
            setIsZoomedIn(true);
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

export const useFetchProductMapping = (startDate, endDate) => {
    const [productMapping, setProductMapping] = useState([]);

    useEffect(() => {
        const fetchProductMapping = () => {
            const dateQuery = startDate && endDate
                ? `from_datetime=${moment(startDate).utc().format()}&to_datetime=${moment(endDate).utc().format()}`
                : '';
            fetch(`/productMapping?${dateQuery}`)
                .then(checkResponse)
                .then((mapping) => {
                    setProductMapping(mapping);
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };

        fetchProductMapping();
    }, [startDate, endDate]);

    return productMapping;
};

export const useAddToUrl = (
    selectedBrands,
    start,
    end,
    selectedLobs,
    pendingStart,
    pendingEnd
) => {
    const history = useHistory();
    const {pathname} = useLocation();

    useEffect(() => {
        if (![EG_BRAND, EGENCIA_BRAND].includes(selectedBrands[0])) {
            history.push(`${pathname}?selectedBrand=${selectedBrands[0]}`
                + `&from=${encodeURIComponent(pendingStart.format())}`
                + `&to=${encodeURIComponent(pendingEnd.format())}`
                + `&lobs=${selectedLobs.map((l) => l.value).join(',')}`
            );
        }
    }, [selectedBrands, start, end, selectedLobs]);
};
