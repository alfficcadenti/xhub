import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {DatetimeRangePicker} from '../../components/DatetimeRangePicker';
import DataTable from '../../components/DataTable';
import moment from 'moment';
import {useFetchIssues} from './hooks';
import {DATE_FORMAT} from '../../constants';
import {validDateRange} from '../utils';
import LoadingContainer from '../../components/LoadingContainer';
import './styles.less';
import {getData} from './utils';


const initialStart = moment().subtract(6, 'months').format(DATE_FORMAT);
const initialEnd = moment().format(DATE_FORMAT);

const Robbie = () => {
    const columns = ['ID', 'PRB', 'Channel ID', 'Email', 'Robbie Reminder', 'Message', 'Notified', 'Status', 'Assignee'];
    const [startDate, setstartDate] = useState(initialStart);
    const [endDate, setendDate] = useState(initialEnd);
    const [isApplyClicked, setIsApplyClicked] = useState(false);
    const [isDirtyForm, setisDirtyForm] = useState(false);

    const applyFilters = () => {
        if (!validDateRange(startDate, endDate)) {
            setstartDate(initialStart);
            setendDate(initialEnd);
        }
        setisDirtyForm(false);
    };

    const [
        isLoading,
        errorMessage,
        items
    ] = useFetchIssues(
        startDate,
        endDate,
        isApplyClicked,
        setIsApplyClicked,
        applyFilters
    );

    const handleDateRangeChange = ({start, end}) => {
        setstartDate(moment(start).format(DATE_FORMAT));
        setendDate(moment(end).format(DATE_FORMAT));
        setisDirtyForm(true);
    };

    const columnsInfo = {
        Status: (
            <div>
                {<div>
                    <div>{'Status of Slack Reminder:'}</div>
                    <div>{' True if successful else returns False'}</div>
                </div>}
            </div>
        ),
        'Robbie Reminder': (
            <div>
                {<ul>
                    <li>{'First: 8 days open'}</li>
                    <li>{'Second: 14 days open'}</li>
                    <li>{'Third: 21 days open'}</li>
                    <li>{'Manager: 28 days open'}</li>
                </ul>
                }
            </div>
        )
    };

    return (
        <div className="robbie-container">
            <h1 className="page-title">
                {'Robbie Notifications'}
            </h1>
            <div className="filters-wrapper">
                <DatetimeRangePicker
                    onChange={handleDateRangeChange}
                    startDate={startDate}
                    endDate={endDate}
                />
                <button
                    type="button"
                    className="apply-button btn btn-primary active"
                    onClick={() => {
                        setIsApplyClicked(true);
                    }}
                    disabled={!isDirtyForm}

                >
                    {'Apply'}
                </button>
            </div>
            <LoadingContainer isLoading={isLoading} error={errorMessage} className="robbie-loading-container" >
                <DataTable className="data-table"
                    data={getData(items)}
                    columns={columns}
                    columnsInfo={columnsInfo}
                    paginated
                />
            </LoadingContainer>
        </div>
    );
};

export default withRouter(Robbie);
