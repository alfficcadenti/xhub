import React from 'react';
import './styles.less';
import DataTable from '../../../../../../components/DataTable';
import {BOOKINGS_DATA_TABLE_COLUMNS} from '../BookingChart/constants';
import react from 'react';
const BookingsDataTable = ({data}) => {
    return (<div className="incident-details-container">
        <div className="table-wrapper">
            <strong>{'Bookings Data Table'}</strong>
            <div className="incident-details">
                <DataTable
                    columns={BOOKINGS_DATA_TABLE_COLUMNS}
                    data={data}
                />
            </div>
        </div>
    </div>);
};

export default react.memo(BookingsDataTable);