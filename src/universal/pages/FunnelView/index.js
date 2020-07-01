import React, {useEffect, useState} from 'react';
import './styles.less';
import SimplifiedWidget from '../../components/SimplifiedWidget';
import moment from 'moment';
// import {BRANDS, EG_BRAND, getBrand} from '../../components/App/constants';
import {pageViewEndpoint} from './mockData';

const FunnelView = () => {
    const [pageViews, setPageViews] = useState([]);

    const pageList = ['home', 'searchResult', 'property', 'bookingForm', 'bookingConfirmation'];
    // const selectedBrands = props.selectedBrands[0] === EG_BRAND
    //     ? BRANDS.map((brand) => brand.landingBrand).filter((brand) => !!brand)
    //     : props.selectedBrands.map((brand) => getBrand(brand).landingBrand).filter((brand) => !!brand);

    const fetchData = () => {
        const pageViewPerPage = pageList.map((page) => {
            const pageViewData = pageViewEndpoint && pageViewEndpoint.map(
                (x) => {
                    return x.pageViews.find((item) => item.page === page) ? {label: moment.utc(x.time).format('HH:mm'), value: x.pageViews.find((item) => item.page === page).count} : 0;
                });
            return {pageName: page, pageViews: pageViewData};
        });
        setPageViews(pageViewPerPage);
    };


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="funnel-views-container">
            <h1>{'Traveler Funnel Page Views'}</h1>
            <div className="page-views-widget-container">
                {pageViews.map((page) =>
                    <SimplifiedWidget title={page.pageName} data={page.pageViews} key={page.pageName}/>
                )}
            </div>
        </div>
    );
};

export default FunnelView;
