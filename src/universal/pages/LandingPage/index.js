import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Alert} from '@homeaway/react-alerts';
import OngoingIncidents from '../../components/OngoingIncidents';
import {CSRData as fetchedCSRData} from './mockData';
// import {bookingsData as fetchedBookingsData} from './mockData';
import {newBookingData as fetchedBookingsData} from './mockData';

import BrandCSRWidget from '../../components/BrandCSRWidget';
import TotalChart from './TotalBookingsChart';
import PropTypes from 'prop-types';
import moment from 'moment';
import './styles.less';

const LandingPage = (props) => {
    const {selectedBrand} = props;
    const brands = ['Vrbo', 'Hotels.com', 'BEX'];

    const [bookingsData, setBookingsData] = useState([]);
    const [CSRData, setCSRData] = useState([]);

    const fetchData = () => {
        const fetchBookingsData = () => {
            // TO BE CHANGED ONCE DATA ARE READY
            // fetch('')
            //     .then((responses) => responses.json())
            //     .then((fetchedBookingsData) => {
            const data = fetchedBookingsData && fetchedBookingsData.data;
            const dataMapped = data.map((x) => {
                return {
                    time: moment.utc(x.time).format('HH:mm'),
                    BEX: x.bookingsData.find((branddata) => branddata.brandGroupName === 'Brand Expedia Group').count || '',
                    Vrbo: x.bookingsData.find((branddata) => branddata.brandGroupName === 'VRBO').count || '',
                    'Hotels.com': x.bookingsData.find((branddata) => branddata.brandGroupName === 'Hotels.com').count || ''
                };
            });
            setBookingsData(dataMapped);
            // })
            // .catch((err) => {
            //     // eslint-disable-next-line no-console
            //     console.error(err);
            // });
        };
        fetchBookingsData();

        const fetchCSRData = () => {
            // TO BE CHANGED ONCE DATA ARE READY
            // fetch('')
            //     .then((responses) => responses.json())
            //     .then((fetchedBookingsData) => {
            const CSRDataFormatted = brands.map((brand) => {
                return {brandName: brand, CSRTrend: fetchedCSRData.map((x) => x[brand] * 100)};
            });

            setCSRData(CSRDataFormatted);
            // })
            // .catch((err) => {
            //     // eslint-disable-next-line no-console
            //     console.error(err);
            // });
        };
        fetchCSRData();
    };


    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 60000);
        return () => clearInterval(interval);
    }, []);


    const covidLink = () => (
        <Link
            to={{pathname: '/incident-trends', search: '?covidFilter=true'}}
            key={'link-covid-incidents'}
        >
            {'Monitor the incidents related to the COVID-19'}
        </Link>
    );

    const selectAll = selectedBrand === 'Expedia Group';
    const chartData = selectAll ? bookingsData : bookingsData.map((x) => ({time: x.time, [selectedBrand]: x[selectedBrand]}));

    return (
        <div className="home-container">
            <div className="row" key="top-row">
                <div id="total-bookings" className="card">
                    <TotalChart data={chartData} brands={selectAll ? brands : [selectedBrand]}/>
                </div>
                <div className="card ongoing-incidents-wrapper">
                    <a target="_blank" rel="noopener noreferrer" href="https://expedia.service-now.com/triage/Triage.do" className="ongoing-incidents-tile-link">
                        <div className="ongoing-incidents-tile-overlay" />
                    </a>
                    <OngoingIncidents />
                </div>
            </div>

            <div className="row" key="bottom-row">
                {CSRData.filter((b) => selectAll || b.brandName === selectedBrand).map((brand) => <BrandCSRWidget brandName={brand.brandName} CSRTrend={brand.CSRTrend} key={brand.brandName}/>)}
            </div>

            <Alert
                className="covid-message"
                title="COVID-19 Updates"
                type="danger"
                msg={covidLink()}
                dismissible
            />
        </div>
    );
};

LandingPage.propTypes = {
    selectedAppBrand: PropTypes.string
};

LandingPage.defaultProps = {
    selectedAppBrand: 'Expedia Group'
};

export default LandingPage;
