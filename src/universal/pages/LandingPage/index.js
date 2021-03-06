import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import OngoingIncidents from '../../components/OngoingIncidents';
import BrandCSRWidget from '../../components/BrandCSRWidget';
import TotalChart from './TotalBookingsChart';
import PropTypes from 'prop-types';
import moment from 'moment';
import {EXPEDIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND, EG_BRAND, BRANDS} from '../../constants';
import './styles.less';
import {formatCSRData} from './utils';
import {checkResponse, getBrand, isNotEmptyString} from '../utils';
import {useQueryParamChange, useSelectedBrand} from '../hooks';


const LandingPage = (props) => {
    const selectedBrands = props.selectedBrands[0] === EG_BRAND
        ? BRANDS.map((brand) => brand.landingBrand).filter(isNotEmptyString)
        : props.selectedBrands.map((brand) => getBrand(brand, 'label').landingBrand).filter(isNotEmptyString);
    const csrWidgetToExclude = [EXPEDIA_PARTNER_SERVICES_BRAND, HOTELS_COM_BRAND];
    const csrSelectedBrands = selectedBrands.filter((selectedBrand) => !csrWidgetToExclude.includes(selectedBrand));

    const [bookingsData, setBookingsData] = useState([]);
    const [CSRData, setCSRData] = useState([]);

    useQueryParamChange(props.onBrandChange);
    useSelectedBrand(props.selectedBrands[0], props.prevSelectedBrand);

    const fetchData = () => {
        const fetchBookingsData = () => {
            fetch('/user-events-api/v1/bookings')
                .then(checkResponse)
                .then((data) => {
                    const dataMapped = data && data.map((x) => {
                        return {
                            time: moment.utc(x.time).format('HH:mm'),
                            [EXPEDIA_BRAND]: x.bookingsData.find((branddata) => branddata.brandGroupName === 'Brand Expedia Group').count || '',
                            [VRBO_BRAND]: x.bookingsData.find((branddata) => branddata.brandGroupName === 'VRBO').count || '',
                            [HOTELS_COM_BRAND]: x.bookingsData.find((branddata) => branddata.brandGroupName === HOTELS_COM_BRAND).count || '',
                            [EXPEDIA_PARTNER_SERVICES_BRAND]: x.bookingsData.find((branddata) => branddata.brandGroupName === 'Expedia Business Services').count || ''
                        };
                    });
                    setBookingsData(dataMapped);
                })
                .catch((err) => {
                    console.error(err);
                });
        };
        fetchBookingsData();

        const fetchCSRData = () => {
            fetch('/user-events-api/v1/checkoutSuccessRate')
                .then((responses) => responses.json())
                .then((fetchedCSRData) => {
                    setCSRData(fetchedCSRData);
                })
                .catch((err) => {
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

    const renderCSR = (formattedCSRdata) => (
        Array.isArray(formattedCSRdata) && formattedCSRdata.length ?
            formattedCSRdata.map(({brandName, CSRTrend}) => (
                <BrandCSRWidget
                    brandName={brandName}
                    CSRTrend={CSRTrend}
                    key={brandName}
                    onBrandChange={props.onBrandChange}
                />
            )) : ''
    );

    const chartData = bookingsData;
    return (
        <div className="home-container">
            <div className="grid-wrapper">
                <div className="total-bookings card">
                    <TotalChart data={chartData} brands={selectedBrands}/>
                </div>
                <div className="ongoing-incidents-wrapper card">
                    <OngoingIncidents selectedBrands={props.selectedBrands} />
                </div>
                {Array.isArray(CSRData) && CSRData.length ?
                    renderCSR(formatCSRData(CSRData, csrSelectedBrands)) :
                    ''
                }
            </div>
        </div>
    );
};

LandingPage.propTypes = {
    selectedBrands: PropTypes.arrayOf(PropTypes.string),
    onBrandChange: PropTypes.func,
    prevSelectedBrand: PropTypes.string
};

LandingPage.defaultProps = {
    selectedBrands: ['Expedia Group']
};

export default withRouter(LandingPage);
