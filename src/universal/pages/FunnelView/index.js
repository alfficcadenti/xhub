import React, {useEffect, useState} from 'react';
import './styles.less';
import SimplifiedWidget from '../../components/SimplifiedWidget';
import moment from 'moment';
import HelpText from '../../components/HelpText/HelpText';
import LoadingContainer from '../../components/LoadingContainer';
// import {BRANDS, EG_BRAND, getBrand} from '../../components/App/constants';
// import {pageViewEndpoint} from './mockData';

const FunnelView = ({selectedBrands}) => {
    const [pageViews, setPageViews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const pageList = [
        {name: 'home', label: 'Home'},
        {name: 'searchresults', label: 'Search'},
        {name: 'property', label: 'Property'},
        {name: 'bookingform', label: 'Booking Form'},
        {name: 'bookingconfirmation', label: 'Booking Confirmation'},
    ];

    const fetchData = ([selectedBrand]) => {
        fetch(`/v1/pageViews?brand=${selectedBrand.toLowerCase()}`)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error();
                }
                return resp.json();
            })
            .then((fetchedPageviews) => {
                const pageViewPerPage = pageList.map((page) => {
                    const pageViewData = fetchedPageviews && fetchedPageviews.map(
                        (x) => {
                            const currentPageViews = x.pageViewsData.find((item) => item.page === page.name);

                            return currentPageViews ? {
                                label: moment.utc(x.time).format('HH:mm UTC'),
                                value: currentPageViews.views
                            } : 0;
                        });
                    return {pageName: page.label, pageViews: pageViewData};
                });
                setPageViews(pageViewPerPage);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                setError('Page Views data not available. Try to refresh');
                // eslint-disable-next-line no-console
                console.error(err);
            });
    };

    useEffect(() => {
        fetchData(selectedBrands);
    }, [selectedBrands]);

    return (
        <div className="funnel-views-container">
            <h1>{'Traveler Page Views'}
                <HelpText className="page-info" text="The charts show the views for each page in the last 24h, display in UTC time" placement="bottom"/>
            </h1>
            <LoadingContainer isLoading={isLoading} error={error} className="incident-main">
                <div className="page-views-widget-container">
                    {pageViews.map((page) =>
                        <SimplifiedWidget title={page.pageName} data={page.pageViews} key={page.pageName}/>
                    )}
                </div>
            </LoadingContainer>

        </div>
    );
};

export default FunnelView;
