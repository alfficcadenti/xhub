import React, {useEffect, useState} from 'react';
import './styles.less';
import SimplifiedWidget from '../../components/SimplifiedWidget';
import moment from 'moment';
// import {BRANDS, EG_BRAND, getBrand} from '../../components/App/constants';
// import {pageViewEndpoint} from './mockData';

const FunnelView = ({selectedBrands}) => {
    const [pageViews, setPageViews] = useState([]);
    const pageList = ['home', 'searchresults', 'property', 'bookingform', 'bookingconfirmation'];

    const fetchData = () => {
        fetch(`/v1/pageViews?brand=${selectedBrands[0]}`)
            .then((responses) => responses.json())
            .then((fetchedPageviews) => {
                const pageViewPerPage = pageList.map((page) => {
                    const pageViewData = fetchedPageviews && fetchedPageviews.map(
                        (x) => {
                            return x.pageViewsData.find((item) => item.page === page) ? {label: moment.utc(x.time).format('HH:mm'), value: x.pageViewsData.find((item) => item.page === page).views} : 0;
                        });
                    return {pageName: page, pageViews: pageViewData};
                });

                setPageViews(pageViewPerPage);
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
            });
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
