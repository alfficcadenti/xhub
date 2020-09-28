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
import {getFilters, getBrandQueryParam, getQueryString, getRevLoss} from './impulseHandler';
import {checkResponse} from '../utils';
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

export const useFetchBlipData = (isApplyClicked, setIsApplyClicked, startDate, endDate, globalBrandName, prevBrand, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, selectedBookingTypeMulti, chartSliced, setChartSliced) => {
    const [res, setRes] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [egSiteURLMulti, setEgSiteURLMulti] = useState({});
    const [lobsMulti, setLobsMulti] = useState({});
    const [brandsMulti, setBrandMulti] = useState({});
    const [deviceTypeMulti, setDeviceTypesMulti] = useState({});
    const [bookingTypeMulti, setBookingTypesMulti] = useState({});
    const [incidentMulti, setIncidentMulti] = useState({});
    const [brandsFilterData, setBrandsFilterData] = useState({});
    const [filterData, setFilterData] = useState({});
    const [annotationsMulti, setAnnotationsMulti] = useState([]);
    const [annotations, setAnnotations] = useState([]);
    const isMount = useIsMount();
    const incidentMultiOptions = [
        {
            value: 'All',
            label: 'All'
        },
        {
            value: '0-Code Red',
            label: '0-Code Red'
        },
        {
            value: '1-Critical',
            label: '1-Critical'
        },
        {
            value: '2-High',
            label: '2-High'
        }];
    const getFilter = () => {
        fetch(`/v1/bookings/filters?filter=lob,brand,egSiteUrl,deviceType,bookingType,brandGroupName${getBrandQueryParam(IMPULSE_MAPPING, globalBrandName)}`)
            .then(checkResponse)
            .then((respJson) => {
                setFilterData(respJson);
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
    const getBrandsFilterData = () => {
        fetch('/v1/bookings/filters/brands')
            .then(checkResponse)
            .then((respJson) => {
                setBrandsFilterData(respJson);
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
            });
    };

    const fetchIncidents = () => {
        const queryString = `fromDate=${moment(startDate).utc().format('YYYY-MM-DD')}&toDate=${moment(endDate).utc().format('YYYY-MM-DD')}`;
        fetch(`/v1/incidents/impulse?${queryString}`)
            .then(checkResponse)
            .then((incidents) => {
                const annotationData = incidents.map((item) => ({
                    ...item,
                    incidentTime: moment.utc(item.startDate).valueOf(),
                    category: 'incidents',
                    time: moment.utc(item.startDate).valueOf(),
                    revLoss: getRevLoss(item)
                }));
                setAnnotations(annotationData);
                setAnnotationsMulti(annotationData);
                setIncidentMulti(incidentMultiOptions);
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
            })
            .then((respJson) => {
                const chartData = respJson.map((item) => {
                    return {
                        time: moment.utc(item.time).valueOf(),
                        [BOOKING_COUNT]: item.count,
                        [PREDICTION_COUNT]: item.prediction.weightedCount
                    };
                });
                return chartData;
            })
            .then((chartData) => {
                setError('');
                setRes(chartData);
                setChartSliced(false);
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
            getBrandsFilterData();
            fetchIncidents();
        } else if (chartSliced || isApplyClicked) {
            getData();
            fetchIncidents();
            getBrandsFilterData();
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
        setEgSiteURLMulti,
        lobsMulti,
        setLobsMulti,
        brandsMulti,
        deviceTypeMulti,
        setDeviceTypesMulti,
        bookingTypeMulti,
        setBookingTypesMulti,
        incidentMulti,
        filterData,
        brandsFilterData,
        annotations,
        annotationsMulti,
        setAnnotationsMulti
    ];
};


