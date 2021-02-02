import {useEffect, useState} from 'react';
import {
    ALL_BRAND_GROUP,
    EGENCIA_BRAND,
    EG_BRAND,
    EXPEDIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND,
    VRBO_BRAND,
    SUPPRESSED_BRANDS
} from '../../constants';
import {getFilters, getBrandQueryParam, getQueryString, getRevLoss, startTime, endTime} from './impulseHandler';
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
const bookingTimeInterval = 300000;
const incidentTimeInterval = 900000;
let initialMount = false;

export const useFetchBlipData = (isApplyClicked, setIsApplyClicked, startDateTime, endDateTime, globalBrandName, prevBrand, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, chartSliced, setChartSliced, isAutoRefresh) => {
    const [res, setRes] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [egSiteURLMulti, setEgSiteURLMulti] = useState({});
    const [lobsMulti, setLobsMulti] = useState({});
    const [brandsMulti, setBrandMulti] = useState({});
    const [deviceTypeMulti, setDeviceTypesMulti] = useState({});
    const [incidentMulti, setIncidentMulti] = useState({});
    const [brandsFilterData, setBrandsFilterData] = useState({});
    const [filterData, setFilterData] = useState({});
    const [annotations, setAnnotations] = useState([]);
    const incidentMultiOptions = [
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
        fetch(`/v1/bookings/filters?filter=lob,brand,egSiteUrl,deviceType,brandGroupName${getBrandQueryParam(IMPULSE_MAPPING, globalBrandName)}`)
            .then(checkResponse)
            .then((respJson) => {
                setFilterData(respJson);
                setEgSiteURLMulti(getFilters(respJson, 'egSiteUrl'));
                setLobsMulti(getFilters(respJson, 'lob'));
                setBrandMulti(getFilters(respJson, 'brand'));
                setDeviceTypesMulti(getFilters(respJson, 'deviceType'));
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

    const fetchIncidents = (start = startDateTime, end = endDateTime) => {
        const queryString = `fromDate=${moment(start).utc().format('YYYY-MM-DD')}&toDate=${moment(end).utc().format('YYYY-MM-DD')}`;
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
                setIncidentMulti(incidentMultiOptions);
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
            });
    };

    const fetchCall = (start, end) => fetch(`/v1/bookings/count${getQueryString(start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti)}`)
        .then(checkResponse)
        .then((respJson) => {
            const chartData = respJson.map((item) => {
                return {
                    time: moment.utc(item.time).valueOf(),
                    [BOOKING_COUNT]: item.count,
                    [PREDICTION_COUNT]: item.prediction.weightedCount
                };
            });
            return chartData;
        });
    const getRealTimeData = () => {
        fetchCall(startTime(), endTime())
            .then((chartData) => {
                setError('');
                setRes(chartData);
                setChartSliced(false);
            })
            .catch((err) => {
                setError('No data found for this selection.');
                // eslint-disable-next-line no-console
                console.error(err);
            });
    };
    const setIntervalForRealTimeData = (timeInterval, type) => setInterval(() => {
        if (type === 'bookingData') {
            getRealTimeData();
        } else if (type === 'incidents') {
            fetchIncidents();
        }
    }, timeInterval);

    const getData = (start = startDateTime, end = endDateTime) => {
        setIsLoading(true);
        fetchCall(start, end)
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
        getData();
        getFilter();
        getBrandsFilterData();
        fetchIncidents();
        setIntervalForRealTimeData(bookingTimeInterval, 'bookingData');
        setIntervalForRealTimeData(incidentTimeInterval, 'incidents');
    }, []);

    useEffect(() => {
        let intervalForCharts;
        let intervalForAnnotations = null;
        if (initialMount) {
            if (SUPPRESSED_BRANDS.includes(globalBrandName)) {
                setError(`Booking data for ${globalBrandName} is not yet available. The following brands are supported at this time: "Expedia", "Hotels.com Retail", and "Expedia Partner Solutions".`);
            } else if (!chartSliced && isAutoRefresh && (moment(endDateTime).diff(moment(startDateTime), 'days') === 3) && (moment().diff(moment(endDateTime), 'days') === 0)) {
                intervalForCharts = setIntervalForRealTimeData(bookingTimeInterval, 'bookingData');
                intervalForAnnotations = setIntervalForRealTimeData(incidentTimeInterval, 'incidents');
                getData(startTime(), endTime());
                fetchIncidents(startTime(), endTime());
            } else if (chartSliced || isApplyClicked) {
                getData();
                fetchIncidents();
                getBrandsFilterData();
            }
        } else {
            initialMount = true;
        }
        return () => {
            setIsApplyClicked(false);
            clearInterval(intervalForCharts);
            clearInterval(intervalForAnnotations);
        };
    }, [isApplyClicked, startDateTime, endDateTime, globalBrandName, isAutoRefresh]);

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
        incidentMulti,
        filterData,
        brandsFilterData,
        annotations
    ];
};


