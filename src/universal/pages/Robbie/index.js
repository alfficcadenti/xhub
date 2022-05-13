import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import DataTable from '../../components/DataTable';
import {DATE_FORMAT} from '../../constants';
import {checkResponse} from '../utils';
import LoadingContainer from '../../components/LoadingContainer';
import {mapNotification} from './utils';
import {COLUMNS, DEFAULT_FROM, DEFAULT_TO, COLUMNS_INFO} from './constants';
import './styles.less';


const Robbie = () => {
    const [from, setFrom] = useState(DEFAULT_FROM);
    const [to, setTo] = useState(DEFAULT_TO);
    const [pendingFrom, setPendingFrom] = useState(DEFAULT_FROM);
    const [pendingTo, setPendingTo] = useState(DEFAULT_TO);
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetch(`/v1/robbie/notification-logs?fromDate=${from.format(DATE_FORMAT)}&toDate=${to.format(DATE_FORMAT)}`)
            .then(checkResponse)
            .then((data) => setNotifications(
                (data || [])
                    .map(mapNotification)
                    .sort((a, b) => (b.Notified).localeCompare(a.Notified))
            ))
            .catch((e) => {
                setError('Could not retrieve all Robbie Notification Logs. Refresh the page to try again.');
                console.error(e);
            })
            .finally(() => setIsLoading(false));
    }, [from, to]);

    const applyFilters = () => {
        setFrom(pendingFrom);
        setTo(pendingTo);
        setIsDirtyForm(false);
    };

    const handleDateRangeChange = ({start, end}) => {
        setPendingFrom(moment(start));
        setPendingTo(moment(end));
        setIsDirtyForm(true);
    };

    return (
        <div className="robbie-container">
            <h1 className="page-title">{'Robbie Notifications'}</h1>
            <div className="filters-wrapper">
                <DatetimeRangePicker
                    onChange={handleDateRangeChange}
                    startDate={pendingFrom.toDate()}
                    endDate={pendingTo.toDate()}
                />
                <button
                    type="button"
                    className="apply-button btn btn-primary active"
                    onClick={applyFilters}
                    disabled={!isDirtyForm}
                >
                    {'Apply'}
                </button>
            </div>
            <LoadingContainer isLoading={isLoading} error={error} className="robbie-loading-container" >
                <DataTable className="data-table"
                    data={notifications}
                    columns={COLUMNS}
                    columnsInfo={COLUMNS_INFO}
                    paginated
                />
            </LoadingContainer>
        </div>
    );
};

export default withRouter(Robbie);
