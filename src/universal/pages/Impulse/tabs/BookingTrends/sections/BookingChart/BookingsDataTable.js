import React from 'react';
import './styles.less';
import DataTable from '../../../../../../components/DataTable';
import {BOOKINGS_DATA_TABLE_COLUMNS, BOOKINGS_DATA_TABLE_HEADERS} from '../BookingChart/constants';
import react from 'react';
import moment from 'moment';

const THREE_WEEK_AVG_COUNT = '3 Week Avg Counts';
const BOOKING_COUNT = 'Booking Counts';
const THREE_WEEK_COMPARISON = '3 Week comparison';
const BookingsDataTable = ({data}) => {
    const threeWeekComparison = (threeWeekAvg, bookingCount) => {
        const per = (Math.round((threeWeekAvg - bookingCount) * 100) / threeWeekAvg).toFixed(2);
        return per + '%';
    };
    const formatBookingsData = () => {
        let finalBookingsData = data.map((item) => ({
            time: `${moment(item.time).format('YYYY-MM-DD HH:mm')} ${moment().tz(moment.tz.guess()).format('z')}`,
            [BOOKING_COUNT]: item[BOOKING_COUNT],
            [THREE_WEEK_AVG_COUNT ]: item[THREE_WEEK_AVG_COUNT],
            [THREE_WEEK_COMPARISON]: threeWeekComparison(item[THREE_WEEK_AVG_COUNT], item[BOOKING_COUNT])

        }));
        return finalBookingsData;
    };

    const checkIsContentPercentage = (content) => {
        if (!Number(content) && content.includes('%')) {
            return content.includes('-') ? 'negative' : 'positive';
        }
        return '';
    };

    return (<div className="incident-details-container">
        <div className="table-wrapper">
            <strong>{'Bookings Data Table'}</strong>
            <div className="incident-details">
                <DataTable
                    columns={BOOKINGS_DATA_TABLE_COLUMNS}
                    rules={[{
                        column: '3 Week comparison',
                        setClass: checkIsContentPercentage
                    }]}
                    columnHeaders={BOOKINGS_DATA_TABLE_HEADERS}
                    data={formatBookingsData()}
                />
            </div>
        </div>
    </div>);
};

export default react.memo(BookingsDataTable);

