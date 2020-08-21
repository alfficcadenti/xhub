import {useEffect, useState} from 'react';
import {
    ALL_LOB,
    ALL_BRANDS,
    ALL_BRAND_GROUP,
    ALL_DEVICE_TYPES,
    ALL_BOOKING_TYPES,
    EGENCIA_BRAND,
    EG_BRAND,
    EXPEDIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND,
    VRBO_BRAND,
    ALL_EG_SITE_URL
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

export const useFetchBlipData = (isApplyClicked, setIsApplyClicked, startDate, endDate, selectedLob, selectedBrand, selectedDeviceType, selectedBookingType, globalBrandName, prevBrand, selectedEGSiteURL) => {
    const [res, setRes] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [bookingTypes, setBookingDevices] = useState([]);
    const [egSiteUrls, setEgSiteUrls] = useState([]);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [lobs, setLobs] = useState([]);
    const isMount = useIsMount();
    const getFilter = () => {
        fetch(`/v1/bookings/filters?filter=lob,brand,egSiteUrl,deviceType,bookingType,brandGroupName${getBrandQueryParam(IMPULSE_MAPPING, globalBrandName)}`)
            .then(checkResponse)
            .then((respJson) => {
                setBookingDevices([ALL_BOOKING_TYPES, ...getFilters(respJson, 'bookingType')[0].sort((A, B) => A.localeCompare(B))]);
                setEgSiteUrls([ALL_EG_SITE_URL, ...getFilters(respJson, 'egSiteUrl')[0].sort((A, B) => A.localeCompare(B))]);
                setDeviceTypes([ALL_DEVICE_TYPES, ...getFilters(respJson, 'deviceType')[0].sort((A, B) => A.localeCompare(B))]);
                setBrands([ALL_BRANDS, ...getFilters(respJson, 'brand')[0].sort((A, B) => A.localeCompare(B))]);
                setLobs([ALL_LOB, ...getFilters(respJson, 'lob')[0].sort((A, B) => A.localeCompare(B))]);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    const getData = () => {
        setIsLoading(true);
        fetch(`/v1/bookings/count${getQueryString(selectedLob, selectedBrand, selectedDeviceType, selectedBookingType, globalBrandName, startDate, endDate, selectedEGSiteURL, IMPULSE_MAPPING, globalBrandName)}`)
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
        bookingTypes,
        egSiteUrls,
        deviceTypes,
        brands,
        lobs
    ];
};


