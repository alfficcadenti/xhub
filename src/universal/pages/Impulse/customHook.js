import {useEffect, useState} from 'react';
import {
    ALL_BRAND_GROUP,
    EGENCIA_BRAND,
    EG_BRAND,
    EXPEDIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND,
    VRBO_BRAND,
} from '../../constants';
import {useIsMount} from '../hooks';
import {getFilters, getBrandQueryParam, getQueryString} from './impulseHandler';
import {checkResponse} from '../utils';

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

export const useFetchBlipData = (isApplyClicked, setIsApplyClicked, startDate, endDate, globalBrandName, prevBrand, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, selectedBookingTypeMulti) => {
    const [res, setRes] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [egSiteURLMulti, setEgSiteURLMulti] = useState({});
    const [lobsMulti, setLobsMulti] = useState({});
    const [brandsMulti, setBrandMulti] = useState({});
    const [deviceTypeMulti, setDeviceTypesMulti] = useState({});
    const [bookingTypeMulti, setBookingTypesMulti] = useState({});
    const isMount = useIsMount();
    const getFilter = () => {
        fetch(`/v1/bookings/filters?filter=lob,brand,egSiteUrl,deviceType,bookingType,brandGroupName${getBrandQueryParam(IMPULSE_MAPPING, globalBrandName)}`)
            .then(checkResponse)
            .then((respJson) => {
                setEgSiteURLMulti(getFilters(respJson, 'egSiteUrl'));
                setLobsMulti(getFilters(respJson, 'lob'));
                setBrandMulti(getFilters(respJson, 'brand'));
                setDeviceTypesMulti(getFilters(respJson, 'deviceType'));
                setBookingTypesMulti(getFilters(respJson, 'bookingType'));
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
            });
    };
    const getData = () => {
        setIsLoading(true);
        fetch(`/v1/bookings/count${getQueryString(startDate, endDate, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, selectedBookingTypeMulti)}`)
            .then((result) => {
                return result.json();
            }
            )
            .then((respJson) => {
                const chartData = respJson.map((item) => {
                    return {
                        time: item.time,
                        [BOOKING_COUNT]: item.count,
                        [PREDICTION_COUNT]: item.prediction.weightedCount
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
                // eslint-disable-next-line no-console
                console.error(err);
            });
    };
    useEffect(() => {
        if (isMount) {
            getData();
            getFilter();
        } else if (isApplyClicked) {
            getData();
        }
        return () => {
            setIsApplyClicked(false);
        };
    }, [isApplyClicked, startDate, endDate, globalBrandName]);
    return [
        isLoading,
        res,
        error,
        egSiteURLMulti,
        lobsMulti,
        brandsMulti,
        deviceTypeMulti,
        bookingTypeMulti
    ];
};


