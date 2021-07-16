/* eslint-disable complexity */
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
import {getFilters, getBrandQueryParam, getQueryString, getRevLoss, startTime, endTime, getCategory, getQueryStringPrediction, simplifyBookingsData, simplifyPredictionData} from './impulseHandler';
import {checkResponse} from '../utils';
import moment from 'moment';

const THREE_WEEK_AVG_COUNT = '3 Week Avg Counts';
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
const bookingTimeInterval = 60000;
const incidentTimeInterval = 900000;
const healthTimeInterval = 300000;
const anomalyTimeInterval = 900000;
let initialMount = false;
let intervalForCharts = null;
let intervalForAnnotations = null;
let intervalForHealth = null;
let intervalForAnomalies = null;

export const useFetchBlipData = (isApplyClicked, setIsApplyClicked, startDateTime, endDateTime, globalBrandName, prevBrand, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, chartSliced, setChartSliced, isAutoRefresh, setAutoRefresh, setStartDateTime, setEndDateTime, timeInterval) => {
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
    const [isLatencyHealthy, setIsLatencyHealthy] = useState(true);
    const [sourceLatency, setSourceLatency] = useState(null);
    const [anomalyAnnotations, setAnomalyAnnotations] = useState([]);
    const [anomaliesMulti, setAnomaliesMulti] = useState({});

    const [groupedResByBrands, setGroupedResByBrands] = useState([]);
    const [groupedResByLobs, setGroupedResByLobs] = useState([]);

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
    const anomalyMultiOptions = [
        {
            value: 'Anomaly Detected',
            label: 'Anomaly Detected'
        },
        {
            value: 'Anomaly Recovered',
            label: 'Anomaly Recovered'
        },
        {
            value: 'Upstream Unhealthy',
            label: 'Upstream Unhealthy'
        }];
    const getFilter = () => {
        fetch(`/v1/bookings/filters?tags=lobs,brands,point_of_sales,device_types,brand_group_names${getBrandQueryParam(IMPULSE_MAPPING, globalBrandName)}`)
            .then(checkResponse)
            .then((respJson) => {
                setFilterData(respJson);
                setEgSiteURLMulti(getFilters(respJson, 'point_of_sales'));
                setLobsMulti(getFilters(respJson, 'lobs'));
                setBrandMulti(getFilters(respJson, 'brands'));
                setDeviceTypesMulti(getFilters(respJson, 'device_types'));
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

    const fetchAnomalies = (start = startDateTime, end = endDateTime) => {
        const queryString = `start_time=${moment(start).utc().format('YYYY-MM-DDTHH:mm:ss')}Z&end_time=${moment(end).utc().format('YYYY-MM-DDTHH:mm:ss')}Z`;
        fetch(`/v1/impulse/anomalies/grouped?${queryString}`)
            .then(checkResponse)
            .then((anomalies) => {
                const filteredAnomalies = anomalies.map((anomaly) => {
                    const impactArr = anomaly.impact.filter((impObj) => impObj.deviceType === 'null');
                    return {
                        ...anomaly,
                        impact: impactArr
                    };
                }).filter((anomaly) => anomaly.impact.length !== 0);
                const anomalyData = filteredAnomalies.map((item) => ({
                    ...item,
                    time: moment.utc(item.timestamp).valueOf(),
                    category: getCategory(item)
                }));
                setAnomalyAnnotations(anomalyData);
                setAnomaliesMulti(anomalyMultiOptions);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    const fetchCall = (start, end, interval) => fetch(`/v1/bookings/count${getQueryString(start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, interval, '')}`)
        .then(checkResponse)
        .then((respJson) => {
            const chartData = respJson.map((item) => {
                return {
                    time: moment.utc(item.time).valueOf(),
                    [BOOKING_COUNT]: item.count,
                    [THREE_WEEK_AVG_COUNT]: item.prediction.weighted_count,
                };
            });
            return chartData;
        });

    const fetchCallGrouped = (start, end, interval, groupType) =>
        fetch(`/v1/bookings/count/group${getQueryString(start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, interval, groupType)}`)
            .then(checkResponse)
            .then((respJson) => (
                respJson.map(({time, count}) => ({
                    time: moment.utc(time).valueOf(),
                    ...count
                }))
            ));

    const fetchPredictions = (start = startDateTime, end = endDateTime, interval = timeInterval, chartData) => {
        Promise.all([
            fetch(`/v1/bookings/count${getQueryString(start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, interval, '')}`).then(checkResponse),
            timeInterval === '5m' ? fetch(`/v1/impulse/prediction${getQueryStringPrediction(start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti)}`).then(checkResponse) : []
        ]).then(([bookingsData, predictionData]) => {
            const simplifiedBookingsData = simplifyBookingsData(bookingsData);
            const simplifiedPredictionData = simplifyPredictionData(predictionData);

            let finalChartData = simplifiedBookingsData;
            let finalChartData2 = simplifiedPredictionData;

            if (simplifiedBookingsData.length === simplifiedPredictionData.length) {
                finalChartData = finalChartData.map((item, i) => {
                    if (simplifiedBookingsData.length && simplifiedPredictionData.length && (simplifiedBookingsData[i].time === simplifiedPredictionData[i].time)) {
                        return {
                            ...item,
                            [PREDICTION_COUNT]: Math.round(simplifiedPredictionData[i].count)
                        };
                    }
                    return item;
                });
            }

            if (chartData && chartData.length && chartData.length < simplifiedPredictionData.length) {
                finalChartData2 = simplifiedPredictionData.map((item, i) => {
                    if (item.time === chartData[i]?.time) {
                        return {
                            ...item,
                            [BOOKING_COUNT]: chartData[i][BOOKING_COUNT],
                            [PREDICTION_COUNT]: Math.round(item.count),
                            [THREE_WEEK_AVG_COUNT]: simplifiedBookingsData[i][THREE_WEEK_AVG_COUNT]
                        };
                    }
                    return {
                        ...item,
                        [BOOKING_COUNT]: 0,
                        [PREDICTION_COUNT]: Math.round(item.count),
                        [THREE_WEEK_AVG_COUNT]: simplifiedBookingsData[i][THREE_WEEK_AVG_COUNT]
                    };
                });

                finalChartData = finalChartData2;
            }

            setRes(finalChartData);
        })
            .catch((err) => {
                console.error(err);
            });
    };

    const fetchHealth = () => {
        fetch('/v1/impulse/health')
            .then(checkResponse)
            .then((respJson) => {
                setSourceLatency(Math.round(respJson.latencyInSecs));
                setIsLatencyHealthy(respJson.isLatencyHealthy);
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
            });
    };

    const getRealTimeData = () => {
        fetchCall(startDateTime, endTime(), timeInterval)
            .then((chartData) => {
                setError('');
                setRes(chartData);
                fetchPredictions(startDateTime, endDateTime, timeInterval, chartData);
            })
            .catch((err) => {
                setError('No data found for this selection.');
                setIsLoading(false);
                // eslint-disable-next-line no-console
                console.error(err);
            });
    };

    const getGroupedBookingsData = (start = startDateTime, end = endDateTime, interval = timeInterval) => {
        Promise.all(['brands', 'lobs'].map((groupType) => fetchCallGrouped(start, end, interval, groupType)))
            .then(([brandsGroupedData, lobsGroupedData]) => {
                setGroupedResByBrands(brandsGroupedData);
                setGroupedResByLobs(lobsGroupedData);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const setIntervalForRealTimeData = (interval, type) => setInterval(() => {
        if (type === 'bookingData') {
            getRealTimeData();
            getGroupedBookingsData(startDateTime, endTime(), timeInterval);
        } else if (type === 'incidents') {
            fetchIncidents();
        } else if (type === 'health') {
            fetchHealth();
        } else if (type === 'anomaly') {
            fetchAnomalies();
        }
    }, interval);

    const getData = (start = startDateTime, end = endDateTime, interval = timeInterval) => {
        setIsLoading(true);
        fetchCall(start, end, interval)
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

    const checkDefaultRange = () => {
        if (!isAutoRefresh) {
            return;
        }
        intervalForCharts = setIntervalForRealTimeData(bookingTimeInterval, 'bookingData');
        intervalForAnnotations = setIntervalForRealTimeData(incidentTimeInterval, 'incidents');
        intervalForAnomalies = setIntervalForRealTimeData(anomalyTimeInterval, 'anomaly');
    };

    const getPredictions = () => {
        const dayRange = moment(endDateTime).diff(moment(startDateTime), 'days');
        if (dayRange >= 1 && dayRange < 7) {
            fetchPredictions();
        }
    };
    useEffect(() => {
        if (SUPPRESSED_BRANDS.includes(globalBrandName)) {
            setError(`Booking data for ${globalBrandName} is not yet available. The following brands are supported at this time: "Expedia", "Hotels.com Retail", and "Expedia Partner Solutions".`);
        } else {
            getGroupedBookingsData();
            getData();
            getFilter();
            getBrandsFilterData();
            fetchIncidents();
            fetchHealth();
            fetchAnomalies();
            getPredictions();
            intervalForCharts = setIntervalForRealTimeData(bookingTimeInterval, 'bookingData');
            intervalForAnnotations = setIntervalForRealTimeData(incidentTimeInterval, 'incidents');
            intervalForHealth = setIntervalForRealTimeData(healthTimeInterval, 'health');
            intervalForAnomalies = setIntervalForRealTimeData(anomalyTimeInterval, 'anomaly');
        }
        return () => {
            clearInterval(intervalForHealth);
        };
    }, []);

    useEffect(() => {
        if (initialMount) {
            if (SUPPRESSED_BRANDS.includes(globalBrandName)) {
                setError(`Booking data for ${globalBrandName} is not yet available. The following brands are supported at this time: "Expedia", "Hotels.com Retail", and "Expedia Partner Solutions".`);
            } else {
                getGroupedBookingsData();
                getData();
                fetchIncidents();
                getFilter();
                getBrandsFilterData();
                checkDefaultRange();
                fetchHealth();
                fetchAnomalies();
                getPredictions();
            }
        }
        return () => {
            clearInterval(intervalForCharts);
            clearInterval(intervalForAnnotations);
            clearInterval(intervalForAnomalies);
        };
    }, [globalBrandName]);


    useEffect(() => {
        if (isApplyClicked) {
            getGroupedBookingsData();
            getData();
            fetchIncidents();
            getBrandsFilterData();
            checkDefaultRange();
            fetchHealth();
            fetchAnomalies();
            getPredictions();

            const dateInvalid = (moment(endDateTime).diff(moment(startDateTime), 'days') >= 5) || (moment().diff(moment(endDateTime), 'hours') > 0);

            if (dateInvalid) {
                setAutoRefresh(false);
            }

            // if ((moment(endDateTime).diff(moment(startDateTime), 'days') > 3) || (moment().diff(moment(endDateTime), 'hours') > 0)) {
            //     clearInterval(intervalForCharts);
            //     clearInterval(intervalForAnnotations);
            //     clearInterval(intervalForAnomalies);
            // }

            return () => {
                setIsApplyClicked(false);
            };
        }

        return () => {
            setIsApplyClicked(false);
            clearInterval(intervalForCharts);
            clearInterval(intervalForAnnotations);
            clearInterval(intervalForAnomalies);
        };
    }, [isApplyClicked]);

    useEffect(() => {
        if (initialMount) {
            if (isAutoRefresh) {
                intervalForCharts = setIntervalForRealTimeData(bookingTimeInterval, 'bookingData');
                intervalForAnnotations = setIntervalForRealTimeData(incidentTimeInterval, 'incidents');
                intervalForAnomalies = setIntervalForRealTimeData(anomalyTimeInterval, 'anomaly');
                getData(startDateTime, endTime(), timeInterval);
                getGroupedBookingsData(startDateTime, endDateTime, timeInterval);
                fetchIncidents(startDateTime, endDateTime);
                fetchHealth();
                fetchAnomalies(startDateTime, endDateTime);
                fetchPredictions(startDateTime, endDateTime, timeInterval);
            }
        } else {
            initialMount = true;
        }
        return () => {
            clearInterval(intervalForCharts);
            clearInterval(intervalForAnnotations);
            clearInterval(intervalForAnomalies);
        };
    }, [isAutoRefresh]);

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
        annotations,
        isLatencyHealthy,
        sourceLatency,
        anomaliesMulti,
        anomalyAnnotations,
        groupedResByBrands,
        groupedResByLobs
    ];
};
