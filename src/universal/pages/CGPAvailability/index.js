import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import LoadingContainer from '../../components/LoadingContainer';
import {checkResponse} from '../utils';
import HeatMap from '../../components/HeatMap';
import moment from 'moment';
import './styles.less';

const CGPAvailibility = () => {
    const [availability, setAvailability] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        setIsLoading(true);
        setError();
        fetch(`/v1/application-availability?from_date=${moment().subtract(7, 'days').format('YYYY-MM-DDTHH:mm:ss[Z]')}&to_date=${moment().format('YYYY-MM-DDTHH:mm:ss[Z]')}`)
            .then(checkResponse)
            .then((resp) => setAvailability(resp))
            .catch(() => setError('Error loading CGP Availability. Try refreshing the page'))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="cgp-availability-container">
            <h1 className="page-title" data-testid="title">{'CGP Availability'}</h1>
            <LoadingContainer isLoading={isLoading} error={error}>
                <HeatMap data={availability} dataLabel="availability" yLabel="applicationName" xLabel="timestamp" dataArrayName="availabilities"/>
            </LoadingContainer>
        </div>
    );
};

export default withRouter(CGPAvailibility);
