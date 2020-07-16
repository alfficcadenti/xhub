import {useEffect, useRef} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'query-string';

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
