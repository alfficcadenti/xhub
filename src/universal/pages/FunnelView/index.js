import React, {useEffect, useState} from 'react';
import {Sankey, Rectangle, Layer, Tooltip, ResponsiveContainer} from 'recharts';
import {Dropdown} from '@homeaway/react-dropdown';
import './styles.less';
import PageView from '../../components/PageView';
import moment from 'moment';
import {BRANDS, EG_BRAND, getBrand} from '../../components/App/constants';
import {funnelViewsData} from './mockData';


const dropdownConfig = [
    {
        label: 'Last 5 minutes',
        frame: ['minutes', 5]
    },
    {
        label: 'Last 30 minutes',
        frame: ['minutes', 30]
    },
    {
        label: 'Last 1 hour',
        frame: ['hours', 1]
    },
    {
        label: 'Last 5 hours',
        frame: ['hours', 5]
    }
];

const sankeyChartdata = {
    nodes: [
        {
            name: 'home page'
        },
        {
            name: 'search'
        },
        {
            name: 'PDP'
        },
        {
            name: 'checkout page'
        },
        {
            name: 'booking confirmation'
        }
    ],
    links: [
        {
            source: 0,
            target: 1,
            value: 400
        },
        {
            source: 1,
            target: 2,
            value: 300
        },
        {
            source: 2,
            target: 3,
            value: 250
        },
        {
            source: 3,
            target: 4,
            value: 200
        }
    ]
};

const CustomNode = ({x, y, width, height, index, payload, containerWidth}) => {
    const isOut = x + width + 6 > containerWidth;

    return (
        <Layer key={`CustomNode${index}`}>
            <Rectangle
                x={x} y={y} width={width} height={height}
                fill="#5192ca" fillOpacity="1"
            />
            <text
                textAnchor={isOut ? 'end' : 'start'}
                x={isOut ? x - 6 : x + width + 6}
                y={y + height / 2}
                fontSize="14"
                stroke="#333"
            >{payload.name}</text>
            <text
                textAnchor={isOut ? 'end' : 'start'}
                x={isOut ? x - 6 : x + width + 6}
                y={y + height / 2 + 13}
                fontSize="12"
                stroke="#333"
                strokeOpacity="0.5"
            >{payload.value}</text>
        </Layer>
    );
};

const FunnelView = (props) => {
    const selectedBrands = props.selectedBrands[0] === EG_BRAND
        ? BRANDS.map((brand) => brand.landingBrand).filter((brand) => !!brand)
        : props.selectedBrands.map((brand) => getBrand(brand).landingBrand).filter((brand) => !!brand);

    const [bookingsData, setBookingsData] = useState([]);
    const [timeFrame, setTimeFrame] = useState(['minutes', 5]);
    const [selectedTimeFrame, setSelectedTimeFrame] = useState(dropdownConfig[0].label);

    const fetchData = () => {
        const fetchBookingsData = () => {
            fetch('https://opxhub-user-events-data-service-egdp-prod.us-east-1-vpc-018bd5207b3335f70.slb.egdp-prod.aws.away.black/v1/bookings')
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
    };


    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const [bucketSize, bucketQuantity] = timeFrame;
        const currentTime = '2020-06-10T13:05:00Z'; // TODO: replace with the real current date once backend data is ready
        const currentBucket = moment(currentTime);
        const bucketEnd = moment(currentBucket).subtract(bucketQuantity, bucketSize);

        const res = funnelViewsData.filter((item) => // TODO: replace funnelViewsData with the real data & use it in Sankey chart
            moment(item.time).isBetween(bucketEnd, currentBucket, '[)'));
        console.log('filtered data for selected time frame for Sankey chart: ', res);
    }, [timeFrame]);

    const renderTimeFrameDropdown = () => (
        <Dropdown
            id="timeframe-dropdown"
            label={selectedTimeFrame}
            className="timeFrame-dropdown"
            closeAfterContentClick
        >
            {
                dropdownConfig.map(({frame, label}) => {
                    return (
                        <li
                            className="timeframe-dropdown-item"
                            key={label}
                            onClick={() => {
                                setTimeFrame(frame);
                                setSelectedTimeFrame(label);
                            }}
                        >
                            {label}
                        </li>
                    );
                })
            }
        </Dropdown>
    );

    return (
        <div className="funnel-views-container">
            <h1>{'Traveler Funnel Page Views'}</h1>
            {renderTimeFrameDropdown()}
            <ResponsiveContainer width="100%" height="90%">
                <Sankey
                    width={960}
                    height={500}
                    data={sankeyChartdata}
                    node={<CustomNode />}
                    nodePading={50}
                    margin={{
                        left: 200,
                        right: 200,
                        top: 100,
                        bottom: 100,
                    }}
                    link={{stroke: '#77c878'}}
                >
                    <Tooltip />
                </Sankey>
            </ResponsiveContainer>

            <div className="grid-wrapper">
                <div className="page-view-chart card">
                    <PageView data={bookingsData} brands={selectedBrands} title="Home and Search Page (SERP)" />
                </div>
                <div className="page-view-chart card">
                    <PageView data={bookingsData} brands={selectedBrands} title="Search (SERP) and Property Page (PDP)" />
                </div>
                <div className="page-view-chart card">
                    <PageView data={bookingsData} brands={selectedBrands} title="Property (PDP) and Checkout Page (CKO)" />
                </div>
                <div className="page-view-chart card">
                    <PageView data={bookingsData} brands={selectedBrands} title="Checkout (CKO) and Checkout Confirmation Page" />
                </div>
            </div>

        </div>
    );
};

export default FunnelView;
