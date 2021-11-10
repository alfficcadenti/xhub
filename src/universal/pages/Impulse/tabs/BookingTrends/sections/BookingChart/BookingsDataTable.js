import React from 'react';
import './styles.less';
import DataTable from '../../../../../../components/DataTable';
import {BOOKINGS_DATA_TABLE_COLUMNS, BOOKINGS_DATA_TABLE_HEADERS} from '../BookingChart/constants';
import react from 'react';
import moment from 'moment';
import {CSVLink} from 'react-csv';
import {checkIsContentPercentage, threeWeekComparison} from '../../../../../utils';

const THREE_WEEK_AVG_COUNT = '3 Week Avg Counts';
const BOOKING_COUNT = 'Booking Counts';
const THREE_WEEK_COMPARISON = '3 Week comparison';

const headers = [
    {label: 'Timestamp', key: 'time'},
    {label: BOOKING_COUNT, key: BOOKING_COUNT},
    {label: THREE_WEEK_AVG_COUNT, key: THREE_WEEK_AVG_COUNT},
    {label: THREE_WEEK_COMPARISON, key: THREE_WEEK_COMPARISON}
];


const BookingsDataTable = ({data}) => {
    const formatBookingsData = () => {
        let finalBookingsData = data.map((item) => ({
            time: `${moment(item.time).format('YYYY-MM-DD HH:mm')} ${moment().tz(moment.tz.guess()).format('z')}`,
            [BOOKING_COUNT]: item[BOOKING_COUNT],
            [THREE_WEEK_AVG_COUNT ]: item[THREE_WEEK_AVG_COUNT],
            [THREE_WEEK_COMPARISON]: threeWeekComparison(item[THREE_WEEK_AVG_COUNT], item[BOOKING_COUNT])

        }));
        return finalBookingsData;
    };
    let filename = `Impulse_Bookings_Data${'_' + moment(data.at(0)?.time)?.format('YYYY-MM-DD') + '_to_' + moment(data.at(-1)?.time)?.format('YYYY-MM-DD')}.csv`;
    const csvReport = {
        data: formatBookingsData(),
        headers,
        filename
    };


    return (<div className="incident-details-container">
        <div className="download-csv" >
            <CSVLink {...csvReport} >
                <button
                    type="button"
                    className={'btn btn-default reset-btn'}
                >{'Export to CSV'}
                </button></CSVLink></div>
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
                    data={csvReport?.data}
                />
            </div>
        </div>
    </div>);
};

export default react.memo(BookingsDataTable);

