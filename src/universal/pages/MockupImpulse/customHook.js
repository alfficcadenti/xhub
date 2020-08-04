import {useEffect, useState} from 'react';
import {
    ALL_LOB,
    ALL_BRANDS,
    ALL_BRAND_GROUP,
    BOOKING_COUNT,
    PREDICTION_COUNT,
    ALL_DEVICE_TYPES,
    ALL_BOOKING_TYPES,
    IMPULSE_MAPPING
} from '../../constants';
import {useIsMount} from '../hooks';
import moment from 'moment';

export const useFetchBlipData = (isApplyClicked, setIsApplyClicked, startDate, endDate, selectedLob, selectedBrand, selectedDeviceType, selectedBookingType, globalBrandName, prevBrand) => {
    const [res, setRes] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [lastStartDate, setLastStartDate] = useState('');
    const [lastEndDate, setLastEndDate] = useState('');
    const isMount = useIsMount();
    const brandChangeFound = globalBrandName !== prevBrand;
    const returnFilterString = (lob, brand, deviceType, bookingType, newBrand, start, end) => {
        const brandGroupName = IMPULSE_MAPPING.find((brandNames) => brandNames.globalFilter === newBrand);
        let query = '';
        if (lob !== ALL_LOB) {
            query = query += `lob=${lob}&`;
        }

        if (brand !== ALL_BRANDS) {
            query = query += `brand=${brand}&`;
        }
        if (brandGroupName.impulseFilter !== ALL_BRAND_GROUP) {
            query = query += brandGroupName.impulseFilter !== 'Egencia' ? `brandGroupName=${encodeURI(brandGroupName.impulseFilter)}&` : `brand=${encodeURI(brandGroupName.impulseFilter)}&`;
        }
        if (deviceType !== ALL_DEVICE_TYPES) {
            query = query += `deviceType=${deviceType}&`;
        }
        if (bookingType !== ALL_BOOKING_TYPES) {
            query = query += `bookingType=${bookingType}&`;
        }
        query = query += `startDate=${start}T00:00:00Z&endDate=${end}T00:00:00Z&`;
        return `?${query.substring(0, query.length - 1)}`;
    };
    useEffect(() => {
        const getData = () => {
            setIsLoading(true);
            setLastStartDate(startDate);
            setLastEndDate(endDate);
            fetch(`http://localhost:8082/v1/bookings/count${returnFilterString(selectedLob, selectedBrand, selectedDeviceType, selectedBookingType, globalBrandName, startDate, endDate)}`)

            // fetch(`/user-events-api/v1/bookings/count${returnFilterString(selectedLob, selectedBrand, selectedDeviceType, selectedBookingType, globalBrandName, startDate, endDate)}`)
                .then((result) => {
                    return result.json();
                }
                )
                .then((respJson) => {
                    console.log(respJson);
                    const chartData = respJson.map((items) => {
                        return {
                            time: moment.utc(items.time).format('HH:mm'),
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
            if (brandChangeFound) {
                getData();
            }
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


