import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
// import {Alert} from '@homeaway/react-alerts';
import OngoingIncidents from '../../components/OngoingIncidents';
import BrandCSRWidget from '../../components/BrandCSRWidget';
import TotalChart from './TotalBookingsChart';
import PropTypes from 'prop-types';
import moment from 'moment';
import {EG_BRAND, BRANDS, getBrand} from '../../components/App/constants';
import './styles.less';

const LandingPage = (props) => {
    const selectedBrands = props.selectedBrands[0] === EG_BRAND
        ? BRANDS.map((brand) => brand.landingBrand).filter((brand) => !!brand)
        : props.selectedBrands.map((brand) => getBrand(brand).landingBrand).filter((brand) => !!brand);

    const [bookingsData, setBookingsData] = useState([]);
    const [CSRData, setCSRData] = useState([]);

    const fetchData = () => {
        const fetchBookingsData = () => {
            fetch('https://opxhub-user-events-data-service.us-east-1.prod.expedia.com/v1/bookings')
                .then((responses) => responses.json())
                .then((data) => {
                    const dataMapped = data && data.map((x) => {
                        return {
                            time: moment.utc(x.time).format('HH:mm'),
                            'BEX': x.bookingsData.find((branddata) => branddata.brandGroupName === 'Brand Expedia Group').count || '',
                            'Vrbo': x.bookingsData.find((branddata) => branddata.brandGroupName === 'VRBO').count || '',
                            'Hotels.com': x.bookingsData.find((branddata) => branddata.brandGroupName === 'Hotels.com').count || '',
                            'Expedia Business Services': x.bookingsData.find((branddata) => branddata.brandGroupName === 'Expedia Business Services').count || ''
                        };
                    });
                    setBookingsData(dataMapped);
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };
        fetchBookingsData();

        const fetchCSRData = () => {
            fetch('https://opxhub-user-events-data-service.us-east-1.prod.expedia.com/v1/checkoutSuccessRate')
                .then((responses) => responses.json())
                .then((fetchedCSRData) => {
                    const mapBrandNames = (brandName) => {
                        switch (brandName) {
                            case 'expedia':
                                return 'BEX';
                            case 'vrbo':
                                return 'Vrbo';
                            case 'hotels':
                                return 'Hotels.com';
                            default:
                                return brandName;
                        }
                    };
                    const CSRDataFormatted = selectedBrands.map((brand) => {
                        const csrData = fetchedCSRData && fetchedCSRData.map(
                            (x) => {
                                return x.checkoutSuccessPercentagesData.find((item) => mapBrandNames(item.brand) === brand) ? x.checkoutSuccessPercentagesData.find((item) => mapBrandNames(item.brand) === brand).rate : 0;
                            });
                        return {brandName: brand, CSRTrend: csrData};
                    });

                    setCSRData(CSRDataFormatted);
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
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


    // const covidLink = () => (
    //     <Link
    //         to={{pathname: '/incident-trends', search: '?covidFilter=true'}}
    //         key={'link-covid-incidents'}
    //     >
    //         {'Monitor the incidents related to the COVID-19'}
    //     </Link>
    // );

    const chartData = bookingsData;
    return (
        <div className="home-container">
            <div className="grid-wrapper">
                <div id="total-bookings" className="card">
                    <TotalChart data={chartData} brands={selectedBrands}/>
                </div>
                <div className="ongoing-incidents-wrapper card">
                    <a target="_blank" rel="noopener noreferrer" href="https://expedia.service-now.com/triage/Triage.do" className="ongoing-incidents-tile-link">
                        <div className="ongoing-incidents-tile-overlay" />
                    </a>
                    <OngoingIncidents />
                </div>
                {CSRData
                    .filter((b) => selectedBrands.includes(b.brandName) || selectedBrands.includes('Expedia Group'))
                    .map((brand) => <BrandCSRWidget brandName={brand.brandName} CSRTrend={brand.CSRTrend} key={brand.brandName}/>)
                }
            </div>
            {/* <Alert*/}
            {/*    className="covid-message"*/}
            {/*    title="COVID-19 Updates"*/}
            {/*    type="danger"*/}
            {/*    msg={covidLink()}*/}
            {/*    dismissible*/}
            {/* />*/}
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
