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
import moment from 'moment';
import all from './implusehandler';

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
    const brandFromMapping = all.getBrandFromImpulseMapping(IMPULSE_MAPPING, globalBrandName).impulseFilter;
    const getBrandQueryParam = () => {
        if (brandFromMapping !== ALL_BRAND_GROUP) {
            return brandFromMapping === EGENCIA_BRAND ? `&brand=${encodeURI(brandFromMapping)}` : `&brandGroupName=${encodeURI(brandFromMapping)}`;
        }
        return '';
    };
    const getQueryParam = (key, value, condition, defaultValue = '') => condition ? `&${key}=${value}` : defaultValue;
    const getQueryString = (lob, brand, deviceType, bookingType, newBrand, start, end, siteUrl) => {
        let query = `?startDate=${start.format('YYYY-MM-DDThh:mm:ss')}Z&endDate=${end.format('YYYY-MM-DDThh:mm:ss')}Z`;
        query += getQueryParam('lob', lob, lob !== ALL_LOB);
        query += getQueryParam('brand', brand, brand !== ALL_BRANDS);
        query += getQueryParam('deviceType', deviceType, deviceType !== ALL_DEVICE_TYPES);
        query += getQueryParam('bookingType', bookingType, bookingType !== ALL_BOOKING_TYPES);
        query += getQueryParam('egSiteUrl', siteUrl, siteUrl !== ALL_EG_SITE_URL);
        query += getBrandQueryParam();
        return query;
    };
    const getFilter = () => {

        fetch(`/user-events-api/v1/bookings/filters?filter=lob,brand,egSiteUrl,deviceType,bookingType,brandGroupName${getBrandQueryParam()}`)
            .then((result) => {
                return result.json();
            }
            )
            .then((respJson) => {
                setBookingDevices([ALL_BOOKING_TYPES, ...all.getFilters(respJson, 'bookingType')[0]]);
                setEgSiteUrls([ALL_EG_SITE_URL, ...all.getFilters(respJson, 'egSiteUrl')[0]]);
                setDeviceTypes([ALL_DEVICE_TYPES, ...all.getFilters(respJson, 'deviceType')[0]]);
                setBrands([ALL_BRANDS, ...all.getFilters(respJson, 'brand')[0]]);
                setLobs([ALL_LOB, ...all.getFilters(respJson, 'lob')[0]]);

            });

    };
    const getData = () => {
        setIsLoading(true);
        fetch(`/user-events-api/v1/bookings/count${getQueryString(selectedLob, selectedBrand, selectedDeviceType, selectedBookingType, globalBrandName, startDate, endDate)}`)
            .then((result) => {
                return result.json();
            }
            )
            .then((respJson) => {
                const chartData = respJson.map((items) => {
                    return {
                        time: moment(items.time).format('MM/DD HH:mm'),
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
    useEffect(() => {
        if (globalBrandName !== prevBrand) {
            getFilter();
        }
        if (isMount || isApplyClicked) {
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


