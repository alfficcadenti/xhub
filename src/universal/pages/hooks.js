import {useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'query-string';
import moment from 'moment';
import 'moment-timezone';
import {checkResponse} from './utils';


export const useIsMount = () => {
    const isMountRef = useRef(true);

    useEffect(() => {
        isMountRef.current = false;
    }, []);

    return isMountRef.current;
};

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
    setWidgets,
    setPendingStart,
    setPendingEnd,
    setCurrentTimeRange,
    setStart,
    setEnd,
    setIsDirtyForm,
    pendingTimeRange
) => {
    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');
    const [chartLeft, setChartLeft] = useState('dataMin');
    const [chartRight, setChartRight] = useState('dataMax');

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
        const fromIdx = widgets[0].aggregatedData.findIndex(({time}) => time === nextRefAreaLeft);
        const toIdx = widgets[0].aggregatedData.findIndex(({time}) => time === nextRefAreaRight);
        // slice data based on new xAxis domain
        const nextWidgets = widgets.map((w) => {
            const nextWidget = w;
            nextWidget.aggregatedData = w.aggregatedData.slice(fromIdx, toIdx);
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


    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        chartLeft,
        chartRight,
        refAreaLeft,
        refAreaRight
    };
};

export const useFetchProductMapping = (startDate, endDate) => {
    const [productMapping, setProductMapping] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const fetchProductMapping = () => {
            const dateQuery = startDate && endDate
                ? `startDate=${moment(startDate).utc().format()}&endDate=${moment(endDate).utc().format()}`
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
        if (isMounted) {
            fetchProductMapping();
        }
        setIsMounted(true);

    }, [startDate, endDate, isMounted]);

    return productMapping;
};
