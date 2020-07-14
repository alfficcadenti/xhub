import {useEffect, useRef} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

export const useIsMount = () => {
    const isMountRef = useRef(true);

    useEffect(() => {
        isMountRef.current = false;
    }, []);

    return isMountRef.current;
};

export const useSelectedBrand = (selectedBrand) => {
    const history = useHistory();
    const {pathname} = useLocation();

    useEffect(() => {
        history.push(`${pathname}?selectedBrand=${selectedBrand}`);
    }, [selectedBrand]);
};
