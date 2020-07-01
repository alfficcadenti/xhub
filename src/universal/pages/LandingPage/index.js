import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
// import {Alert} from '@homeaway/react-alerts';
import OngoingIncidents from '../../components/OngoingIncidents';
import BrandCSRWidget from '../../components/BrandCSRWidget';
import TotalChart from './TotalBookingsChart';
import PropTypes from 'prop-types';
import moment from 'moment';
import {EXPEDIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND, EXPEDIA_BUSINESS_SERVICES_BRAND, EG_BRAND, BRANDS, getBrand} from '../../constants';
import './styles.less';

const LandingPage = (props) => {
    const selectedBrands = props.selectedBrands[0] === EG_BRAND
        ? BRANDS.map((brand) => brand.landingBrand).filter((brand) => !!brand)
        : props.selectedBrands.map((brand) => getBrand(brand).landingBrand).filter((brand) => !!brand);
    const csrWidgetToExclude = EXPEDIA_BUSINESS_SERVICES_BRAND;
    const csrSelectedBrands = selectedBrands.filter((selectedBrand) => selectedBrand !== csrWidgetToExclude);

    const [bookingsData, setBookingsData] = useState([]);
    const [CSRData, setCSRData] = useState([]);

    const fetchData = () => {
        const fetchBookingsData = () => {
            fetch('/user-events-api/v1/bookings')
                .then((responses) => responses.json())
                .then((data) => {
                    const dataMapped = data && data.map((x) => {
                        return {
                            time: moment.utc(x.time).format('HH:mm'),
                            [EXPEDIA_BRAND]: x.bookingsData.find((branddata) => branddata.brandGroupName === 'Brand Expedia Group').count || '',
                            [VRBO_BRAND]: x.bookingsData.find((branddata) => branddata.brandGroupName === 'VRBO').count || '',
                            [HOTELS_COM_BRAND]: x.bookingsData.find((branddata) => branddata.brandGroupName === 'Hotels.com').count || '',
                            [EXPEDIA_BUSINESS_SERVICES_BRAND]: x.bookingsData.find((branddata) => branddata.brandGroupName === 'Expedia Business Services').count || ''
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
            fetch('/user-events-api/v1/checkoutSuccessRate')
                .then((responses) => responses.json())
                .then((fetchedCSRData) => {
                    const mapBrandNames = (brandName) => {
                        switch (brandName) {
                            case 'expedia':
                                return EXPEDIA_BRAND;
                            case 'vrbo':
                                return VRBO_BRAND;
                            case 'hotels':
                                return HOTELS_COM_BRAND;
                            default:
                                return brandName;
                        }
                    };
                    const CSRDataFormatted = csrSelectedBrands.map((brand) => {
                        const csrData = fetchedCSRData && fetchedCSRData.map(
                            (x) => {
                                return x.checkoutSuccessPercentagesData.find((item) => mapBrandNames(item.brand) === brand) ? x.checkoutSuccessPercentagesData.find((item) => mapBrandNames(item.brand) === brand).rate : '';
                            }).filter((n) => n);
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
                    .filter(({brandName}) => csrSelectedBrands.includes(brandName) || csrSelectedBrands.includes('Expedia Group'))
                    .map(({brandName, CSRTrend}) => (
                        <BrandCSRWidget
                            brandName={brandName}
                            CSRTrend={CSRTrend}
                            key={brandName}
                            onBrandChange={props.onBrandChange}
                        />
                    ))
                }
            </div>
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
