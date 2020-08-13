import {useEffect, useState} from 'react';
import {
    ALL_LOB,
    ALL_BRANDS,
    ALL_BRAND_GROUP,
    ALL_DEVICE_TYPES,
    ALL_BOOKING_TYPES,
    EGENCIA_BRAND, EG_BRAND, EXPEDIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND, HOTELS_COM_BRAND, VRBO_BRAND
} from '../../constants';
import {useIsMount} from '../hooks';
import moment from 'moment';

const PREDICTION_COUNT = 'Prediction Counts';
const BOOKING_COUNT = 'Booking Counts';
const IMPULSE_MAPPING = [
    {globalFilter: EG_BRAND, impulseFilter: ALL_BRAND_GROUP},
    {globalFilter: EXPEDIA_BRAND, impulseFilter: 'Brand Expedia Group'},
    {globalFilter: EXPEDIA_PARTNER_SERVICES_BRAND, impulseFilter: 'Expedia Business Services'},
    {globalFilter: HOTELS_COM_BRAND, impulseFilter: HOTELS_COM_BRAND},
    {globalFilter: EGENCIA_BRAND, impulseFilter: EGENCIA_BRAND},
    {globalFilter: VRBO_BRAND, impulseFilter: 'VRBO'}
];

export const useFetchBlipData = (isApplyClicked, setIsApplyClicked, startDate, endDate, selectedLob, selectedBrand, selectedDeviceType, selectedBookingType, globalBrandName) => {
    const [res, setRes] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [lastStartDate, setLastStartDate] = useState('');
    const [lastEndDate, setLastEndDate] = useState('');
    const isMount = useIsMount();
    const getQueryParam = (key, value, condition, defaultValue = '') => condition ? `&${key}=${value}` : defaultValue;
    const getQueryString = (lob, brand, deviceType, bookingType, newBrand, start, end) => {
        const brandGroupName = IMPULSE_MAPPING.find((brandNames) => brandNames.globalFilter === newBrand);
        let query = `?startDate=${start.format('YYYY-MM-DDThh:mm:ss')}Z&endDate=${end.format('YYYY-MM-DDThh:mm:ss')}Z`;
        query += getQueryParam('lob', lob, lob !== ALL_LOB);
        query += getQueryParam('brand', brand, brand !== ALL_BRANDS);
        query += getQueryParam('deviceType', deviceType, deviceType !== ALL_DEVICE_TYPES);
        query += getQueryParam('bookingType', bookingType, bookingType !== ALL_BOOKING_TYPES);
        if (brandGroupName.impulseFilter !== ALL_BRAND_GROUP) {
            query += brandGroupName.impulseFilter !== EGENCIA_BRAND ? `&brandGroupName=${encodeURI(brandGroupName.impulseFilter)}` : `&brand=${encodeURI(brandGroupName.impulseFilter)}`;
        }
        return query;
    };
    useEffect(() => {
        const getData = () => {
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);
            fetch(`/user-events-api/v1/bookings/count${getQueryString(selectedLob, selectedBrand, selectedDeviceType, selectedBookingType, globalBrandName, startDate, endDate)}`)
                .then((result) => {
                    return result.json();
                }
                )
                .then((respJson) => {
                    const chartData = respJson.map((items) => {
                        return {
                            time: moment(items.time).format('DD MM HH:mm'),
                            [BOOKING_COUNT]: items.count,
                            [PREDICTION_COUNT]: items.prediction.weightedCount
                        };
                    });
                    return chartData;
                })
                .then((chartData) => {
                    setError('');
                    setRes(chartData);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    setError('No data found for this selection.');
                    console.error(err);
                });
        };

        if (isMount) {
            getData();
        }
        if (isApplyClicked) {
            if (lastStartDate !== startDate || lastEndDate !== endDate) {
                getData();
            } else {
                getData();
            }
        }
        return () => {
            setIsApplyClicked(false);
        };
    }, [isApplyClicked, startDate, endDate, globalBrandName]);
    return [
        isLoading,
        res,
        error
    ];
};


