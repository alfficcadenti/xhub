import {useEffect, useState, useRef} from 'react';
import {
    ALL_LOB,
    ALL_BRANDS,
    ALL_BRAND_GROUP,
} from '../../constants';
export const useIsMount = () => {
    const isMountRef = useRef(true);

    useEffect(() => {
        isMountRef.current = false;
    }, []);

    return isMountRef.current;
};

export const useFetchBlipData = (isApplyClicked, setIsApplyClicked, startDate, endDate, selectedLob, selectedBrand, selectedInterval, selectedBrandGroup) => {
    const [res, setRes] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [lastStartDate, setLastStartDate] = useState('');
    const [lastEndDate, setLastEndDate] = useState('');
    const isMount = useIsMount();
    const returnFilterString = (...queryPrams) => {
        const [lob, timeInterval, brand, brandGroup] = queryPrams;
        let query = '';
        if (lob !== ALL_LOB) {
            query = query += `lob=${lob}&`;
        }

        if (brand !== ALL_BRANDS) {
            query = query += `brand=${brand}&`;
        }
        if (brandGroup !== ALL_BRAND_GROUP) {
            query = query += `brandGroupName=${brandGroup}&`;
        }

        query = query += `timeInterval=${timeInterval.match(/\d+/g)}&`;

        return `?${query.substring(0, query.length - 1)}`;
    };
    useEffect(() => {
        const getData = () => {
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);
            fetch(`/impulse-api/v1/bookings${returnFilterString(selectedLob, selectedInterval, selectedBrand, selectedBrandGroup)}`)
                .then((result) => {
                    return result.json();
                }
                )
                .then((resJson) => {
                    setError('');
                    setRes(resJson);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    setError('No data found for this selection.');
                    console.error('in Error', err);
                });
        };

        if (isMount) {
            getData();
        } else if (isApplyClicked) {
            if (lastStartDate !== startDate || lastEndDate !== endDate) {
                getData();
            } else {
                getData();
            }
        }
        return () => {
            setIsApplyClicked(false);
        };
    }, [isApplyClicked, startDate, endDate]);
    return [
        isLoading,
        res,
        error
    ];
};


