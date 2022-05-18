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
import {
    getFilters,
    getBrandQueryParam,
    getQueryString,
    getRevLoss,
    startTime,
    endTime,
    getCategory,
    getQueryStringPrediction,
    simplifyPredictionData,
    getQueryStringPercentageChange,
    getQueryStringYOY,
    mapPosFilterLabels,
    mapPosChartData,
} from './impulseHandler';
import {
    checkResponse,
    checkIsDateInvalid,
    getChartDataForFutureEvents,
    mapGroupedData,
    regionalGroupedData
} from '../utils';
import moment from 'moment';

const THREE_WEEK_AVG_COUNT = '3 Week Avg Counts';
const PREDICTION_COUNT = 'Prediction Counts';
const PERCENTAGE_BOOKING_DROP = 'Percentage Booking Drop';
const YOY_COUNT = 'YOY Counts';
const BOOKING_COUNT = 'Booking Counts';
const IMPULSE_MAPPING = [
    {globalFilter: EG_BRAND, impulseFilter: ALL_BRAND_GROUP},
    {globalFilter: EXPEDIA_BRAND, impulseFilter: 'Brand Expedia Group'},
    {globalFilter: EXPEDIA_PARTNER_SERVICES_BRAND, impulseFilter: 'Expedia Business Services'},
    {globalFilter: HOTELS_COM_BRAND, impulseFilter: HOTELS_COM_BRAND},
    {globalFilter: VRBO_BRAND, impulseFilter: 'Vrbo'},
    {globalFilter: EGENCIA_BRAND, impulseFilter: EGENCIA_BRAND},
];
const bookingTimeInterval = 300000;
const incidentTimeInterval = 900000;
const healthTimeInterval = 300000;
const anomalyTimeInterval = 900000;
const allPos = [];
let initialMount = false;
let intervalForCharts = null;
let intervalForAnnotations = null;
let intervalForHealth = null;
let intervalForAnomalies = null;
let finalChartDataYOY = null;
let chartData = null;

export const useFetchBlipData = (
    isApplyClicked,
    setIsApplyClicked,
    startDateTime,
    endDateTime,
    globalBrandName,
    prevBrand,
    selectedSiteURLMulti,
    selectedLobMulti,
    selectedBrandMulti,
    selectedDeviceTypeMulti,
    chartSliced,
    setChartSliced,
    isAutoRefresh,
    setAutoRefresh,
    setStartDateTime,
    setEndDateTime, timeInterval,
    isResetClicked,
    setIsResetClicked,
    allData,
    isChartSliceClicked,
    setIsChartSliceClicked,
    getScreenshot,
    setGraphImage
) => {
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
    const [groupedResByPos, setGroupedResByPos] = useState([]);
    const [groupedResByDeviceType, setGroupedResByDeviceType] = useState([]);
    const [groupedResByRegion, setGroupedResByRegion] = useState([]);

    const [averageCount, setAverageCount] = useState({});
    const [isAverageCountLoading, setIsAverageCountLoading] = useState(false);
    const [isEpsPresentInBrands, setIsEpsPresentInBrands] = useState(false);
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
                setEgSiteURLMulti(mapPosFilterLabels(getFilters(respJson, 'point_of_sales')));
                setLobsMulti(getFilters(respJson, 'lobs'));
                setBrandMulti(getFilters(respJson, 'brands'));
                setDeviceTypesMulti(getFilters(respJson, 'device_types'));
            })
            .catch((err) => {
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
                console.error(err);
            });
    };

    const fetchAnomalies = (start = startDateTime, end = endDateTime) => {
        const queryString = `start_time=${moment(start).utc().format('YYYY-MM-DDTHH:mm:ss')}Z&end_time=${moment(end).utc().format('YYYY-MM-DDTHH:mm:ss')}Z`;
        fetch(`/v1/impulse/anomalies/grouped?${queryString}`)
            .then(checkResponse)
            .then((anomalies) => {
                const filteredAnomalies = anomalies.map((anomaly) => {
                    return {
                        ...anomaly,
                        impact: anomaly.impact
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
    const fetchData = (start, end, interval) => fetch(`/v1/bookings/count${getQueryString(start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, interval, '')}`)
        .then(checkResponse)
        .then((respJson) => {
            chartData = respJson.map((item) => {
                return {
                    time: moment.utc(item.time).valueOf(),
                    [BOOKING_COUNT]: item.count,
                    [THREE_WEEK_AVG_COUNT]: item?.prediction?.weighted_count ? item.prediction.weighted_count : 0,
                };
            });
            if (finalChartDataYOY && finalChartDataYOY.length === chartData?.length) {
                chartData = chartData.map((item, i) => {
                    return {
                        ...item,
                        [YOY_COUNT]: finalChartDataYOY[i]?.count ? finalChartDataYOY[i]?.count : 0
                    };
                });
            }
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

    const fetchPredictions = (start = startDateTime, end = endDateTime, interval = timeInterval) => {
        Promise.all([
            timeInterval === '5m' || timeInterval === '1m' ? fetch(`/v1/impulse/prediction${getQueryStringPrediction(start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, interval)}`).then(checkResponse) : []
        ]).then(([predictionData]) => {
            const simplifiedPredictionData = simplifyPredictionData(predictionData);

            let finalChartData = chartData;
            let chartDataForFutureEvents = simplifiedPredictionData;

            if (chartData.length === simplifiedPredictionData.length) {
                finalChartData = finalChartData.map((item, i) => {
                    if (chartData.length && simplifiedPredictionData.length && (chartData[i].time === simplifiedPredictionData[i].time)) {
                        return {
                            ...item,
                            [PREDICTION_COUNT]: simplifiedPredictionData[i]?.count ? Math.round(simplifiedPredictionData[i].count) : 0,
                            [PERCENTAGE_BOOKING_DROP]: simplifiedPredictionData[i]?.count ? Math.round((chartData[i][BOOKING_COUNT] - Number(simplifiedPredictionData[i].count)) / Number(simplifiedPredictionData[i].count) * 100) : 'NA'
                        };
                    }
                    return item;
                });
            }

            const dateInvalid = checkIsDateInvalid(startDateTime, endDateTime);

            finalChartData = getChartDataForFutureEvents(dateInvalid, chartData, simplifiedPredictionData, chartDataForFutureEvents, finalChartData);

            setRes(finalChartData);
        })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                getScreenshot();
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
                console.error(err);
            });
    };

    const fetchAverage = () => {
        setIsAverageCountLoading(true);
        fetch(`/v1/bookings/change/percentage${getQueryStringPercentageChange(selectedLobMulti, selectedBrandMulti)}`)
            .then(checkResponse)
            .then(({selectedLobs, weekly, monthly, yearly}) => setAverageCount({selectedLobs, weekly, monthly, yearly}))
            .catch((err) => {
                setError('No data found for this selection.');
                console.error(err);
            })
            .finally(() => setIsAverageCountLoading(false));
    };

    const fetchCallYOY = (start = startDateTime, end = endDateTime, interval = timeInterval) =>
        fetch(`/v1/bookings/count/YOY${getQueryStringYOY(start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, interval)}`)
            .then(checkResponse)
            .then((respJson) => {
                if (Array.isArray(respJson)) {
                    finalChartDataYOY = respJson.map((item) => ({
                        time: moment.utc(item.time).valueOf(),
                        count: item.count
                    }));
                } else {
                    finalChartDataYOY = [];
                }
            })
            .catch((err) => {
                setError('No data found for this selection.');
                console.error(err);
            });

    const getPredictions = (start, end, interval) => {
        const dayRange = moment(endDateTime).diff(moment(startDateTime), 'days');
        if (dayRange < 7) {
            fetchPredictions(start, end, interval);
        } else {
            getScreenshot();
        }
    };

    const getRealTimeData = () => {
        const futureEvent = moment(endDateTime).diff(moment(endTime()), 'minutes') >= 5;
        const defaultRange = moment(endDateTime).diff(moment(startDateTime), 'hours') === 72;

        fetchData(startDateTime, endTime(), timeInterval)
            .then((respJson) => {
                setError('');

                getPredictions(startDateTime, futureEvent ? endDateTime : endTime(), timeInterval);

                if (!futureEvent) {
                    setEndDateTime(endTime());
                    setRes(respJson);

                    if (defaultRange) {
                        setStartDateTime(startTime());
                    }
                } else {
                    fetchData(startDateTime, endDateTime, timeInterval)
                        .then((data) => {
                            const newData = data.map((item, i) => {
                                if (item.time === respJson[i]?.time) {
                                    item[BOOKING_COUNT] = respJson[i][BOOKING_COUNT];
                                }
                                return item;
                            });

                            if (newData.length <= respJson.length) {
                                setRes(respJson);
                            } else {
                                setRes(newData);
                            }
                        })
                        .catch((err) => {
                            setError('No data found for this selection.');
                            setIsLoading(false);
                            console.error(err);
                        });
                }
            })
            .catch((err) => {
                setError('No data found for this selection.');
                setIsLoading(false);
                console.error(err);
            });
    };

    const getGroupedBookingsData = (start = startDateTime, end = endDateTime, interval = timeInterval) => {
        let groupTypes = ['brands', 'lobs', 'device_types', 'region'];
        if (selectedSiteURLMulti.length && selectedSiteURLMulti.length <= 10) {
            groupTypes.push('point_of_sales');
        } else {
            setGroupedResByPos([]);
        }
        Promise.all(groupTypes.map((groupType) => fetchCallGrouped(start, end, interval, groupType)))
            .then(([brandsGroupedData, lobsGroupedData, deviceTypeGroupedData, regionGroupedData, posGroupedData]) => {
                const futureEvent = moment(endDateTime).diff(moment(endTime()), 'minutes') >= 5;

                if (futureEvent) {
                    Promise.all(groupTypes.map((groupType) => fetchCallGrouped(start, endDateTime, interval, groupType)))
                        .then(([brandsGroupedDataFuture, lobsGroupedDataFuture, deviceTypeGroupedDataFuture, regionGroupedDataFuture, posGroupedDataFuture]) => {
                            const newBrandsGroupedData = mapGroupedData(brandsGroupedDataFuture, brandsGroupedData);
                            const newLobsGroupedData = mapGroupedData(lobsGroupedDataFuture, lobsGroupedData);
                            const newDeviceTypeGroupedData = mapGroupedData(deviceTypeGroupedDataFuture, deviceTypeGroupedData);
                            const newRegionGroupedDataFuture = mapGroupedData(regionGroupedDataFuture, regionGroupedData);
                            regionalGroupedData(newRegionGroupedDataFuture);


                            if (selectedSiteURLMulti.length && selectedSiteURLMulti.length <= 10) {
                                const newPosGroupedData = mapPosChartData(mapGroupedData(posGroupedDataFuture, posGroupedData));
                                setGroupedResByPos(newPosGroupedData);
                            } else {
                                setGroupedResByPos([]);
                            }
                            setGroupedResByBrands(newBrandsGroupedData);
                            setGroupedResByLobs(newLobsGroupedData);
                            setGroupedResByDeviceType(newDeviceTypeGroupedData);
                            setGroupedResByRegion(newRegionGroupedDataFuture);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                } else {
                    regionalGroupedData(regionGroupedData);
                    setGroupedResByBrands(brandsGroupedData);
                    setGroupedResByLobs(lobsGroupedData);
                    if (selectedSiteURLMulti.length && selectedSiteURLMulti.length <= 10) {
                        const newPosGroupedData = mapPosChartData(posGroupedData);
                        setGroupedResByPos(newPosGroupedData);
                    } else {
                        setGroupedResByPos([]);
                    }
                    setGroupedResByDeviceType(deviceTypeGroupedData);
                    setGroupedResByRegion(regionGroupedData);
                }
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
        setGraphImage(null);
        fetchData(start, end, interval)
            .then((respJson) => {
                setError('');
                setRes(respJson);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                setError('No data found for this selection.');
                console.error(err);
            });
    };

    const checkRefreshRange = () => {
        const isRefreshRange = (moment(endDateTime).diff(moment(startDateTime), 'days') <= 5) && (moment().diff(moment(endDateTime), 'minutes') < 5);

        if (isAutoRefresh && isRefreshRange) {
            intervalForCharts = setIntervalForRealTimeData(bookingTimeInterval, 'bookingData');
            intervalForAnnotations = setIntervalForRealTimeData(incidentTimeInterval, 'incidents');
            intervalForAnomalies = setIntervalForRealTimeData(anomalyTimeInterval, 'anomaly');
        }
    };

    useEffect(() => {
        if (Object.keys(egSiteURLMulti).length === 0) {
            return;
        }
        egSiteURLMulti.forEach((egSiteValueAndLabel) => {
            allPos.push(egSiteValueAndLabel.label);
        });
    }, [egSiteURLMulti]);

    useEffect(() => {
        fetchAverage();
    }, [isApplyClicked]);

    useEffect(() => {
        if (Object.keys(brandsMulti).length === 0) {
            return;
        }
        const foundEps = brandsMulti.find((brand) => brand.value === EXPEDIA_PARTNER_SERVICES_BRAND && brand.label === EXPEDIA_PARTNER_SERVICES_BRAND);
        setIsEpsPresentInBrands(foundEps);
    }, [brandsMulti]);

    useEffect(() => {
        if (SUPPRESSED_BRANDS.includes(globalBrandName)) {
            setError(`Booking data for ${globalBrandName} is not yet available. The following brands are supported at this time: "Expedia", "Hotels.com Retail", and "Expedia Partner Solutions".`);
        } else {
            fetchCallYOY();
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
                fetchCallYOY();
                getGroupedBookingsData();
                getData();
                fetchIncidents();
                getFilter();
                getBrandsFilterData();
                checkRefreshRange();
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
        const dateInvalid = checkIsDateInvalid(startDateTime, endDateTime);

        if (isApplyClicked || isResetClicked || isChartSliceClicked) {
            fetchCallYOY();
            getGroupedBookingsData();
            getData();
            fetchIncidents();
            getBrandsFilterData();
            fetchHealth();
            fetchAnomalies();
            getPredictions();

            if (dateInvalid || !isAutoRefresh) {
                setAutoRefresh(false);
                clearInterval(intervalForCharts);
                clearInterval(intervalForAnnotations);
                clearInterval(intervalForAnomalies);
            } else {
                checkRefreshRange();
            }

            if (isResetClicked) {
                setAutoRefresh(true);
            }

            return () => {
                setIsApplyClicked(false);
                setIsResetClicked(false);
                setIsChartSliceClicked(false);
            };
        }

        return () => {
            setIsApplyClicked(false);
            setIsResetClicked(false);
            setIsChartSliceClicked(false);
            clearInterval(intervalForCharts);
            clearInterval(intervalForAnnotations);
            clearInterval(intervalForAnomalies);
        };
    }, [isApplyClicked, isResetClicked, isChartSliceClicked]);

    useEffect(() => {
        if (initialMount) {
            if (isAutoRefresh) {
                intervalForCharts = setIntervalForRealTimeData(bookingTimeInterval, 'bookingData');
                intervalForAnnotations = setIntervalForRealTimeData(incidentTimeInterval, 'incidents');
                intervalForAnomalies = setIntervalForRealTimeData(anomalyTimeInterval, 'anomaly');
                getData(startDateTime, endTime(), timeInterval);
                getGroupedBookingsData(startDateTime, endDateTime, timeInterval);
                fetchCallYOY(startDateTime, endDateTime, timeInterval);
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
        groupedResByLobs,
        groupedResByPos,
        groupedResByDeviceType,
        groupedResByRegion,
        averageCount,
        isAverageCountLoading,
        isEpsPresentInBrands,
        allPos
    ];
};
