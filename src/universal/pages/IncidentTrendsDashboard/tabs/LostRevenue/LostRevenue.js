import React, {useState, useEffect} from 'react';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    LineChart
} from 'recharts';
import helpers from '../../incidentsHelper';
import moment from 'moment';
import LoadingContainer from '../../../../components/LoadingContainer';


function useRevenueLoss() {
    const [lostRevenues, setLostRevenues] = useState(null);
    const [brands, setBrands] = useState(null);
    const [opacity, setOpacity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const startDate = '2019-10-28';
    const endDate = '2020-01-19';

    const filterByBrand = (data = [], brandName) => data.filter((item) => item.brand === brandName);

    const sumBrandLossPerInterval = (data = [], brandName) => {
        const filteredByBrand = filterByBrand(data, brandName);

        return filteredByBrand.reduce((acc, curr) => {
            return (acc + Number(curr.estimatedLostRevenue));
        }, 0) || 0;
    };

    const createOpacityConfig = (legendLabels) => {
        return legendLabels.reduce((prev, legendLabel) => ({
            ...prev,
            [legendLabel]: 1
        }), {});
    };

    const extractBrandNames = (data) => data
        .map((item) => item.brand)
        .filter(helpers.distinct);

    const prepareDataForChart = (data, brandsNames) => {
        const [lowerMarginDateValue, maxMarginDateValue] = helpers.getMarginDateValues(data);
        const weekIntervals = helpers.weeklyRange(lowerMarginDateValue, maxMarginDateValue);

        // sum up lost revenue values for each brand (per each week interval)
        // make recharts-like data to feed into chart

        return weekIntervals.reduce((prev, weekInterval) => {
            const incidentsPerInterval = helpers.incidentsOfTheWeek(data, moment(weekInterval).week());

            const newMetricPoint = brandsNames.reduce((map, brand) => ({
                ...map,
                [brand]: sumBrandLossPerInterval(incidentsPerInterval, brand)
            }), {});

            newMetricPoint.weekInterval = weekInterval;

            return [
                ...prev,
                newMetricPoint
            ];
        }, []);
    };

    useEffect(() => {
        fetch(`/api/v1/lostrevenue?startDate=${startDate}&endDate=${endDate}`)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error();
                }
                return resp.json();
            })
            .then((incidents) => {
                const brandNames = extractBrandNames(incidents);
                const opacityConfig = createOpacityConfig(brandNames);
                setOpacity(opacityConfig);
                setBrands(brandNames);
                const readyData = prepareDataForChart(incidents, brandNames);
                setLostRevenues(readyData);
                setIsLoading(false);
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    }, []);

    const handleOnClick = (e) => {
        const {dataKey} = e;
        const toggleOpacity = (prop) => prop === 0.2 ? 1 : 0.2;

        setOpacity({
            ...opacity,
            [dataKey]: toggleOpacity(opacity[dataKey])
        });
    };

    return {
        lostRevenues,
        brands,
        handleOnClick,
        isLoading,
        opacity
    };
}

const LostRevenue = () => {
    const {handleOnClick, opacity, lostRevenues, brands, isLoading} = useRevenueLoss();

    return (<div id="lost-revenue">
        <LoadingContainer isLoading={isLoading} id={'incident-main-div'}>
            <LineChart
                width={1000}
                height={300}
                data={lostRevenues}
                marginTop={200}
            >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="weekInterval" />
                <YAxis width={100} />
                <Legend onClick={handleOnClick}/>
                <Legend />
                {
                    brands && brands.map((brand, i) => {
                        return <Line type="monotone" dataKey={brand} stroke={`#${i}88${i}d8`} key={brand} strokeOpacity={opacity[brand]} />;
                    })
                }
            </LineChart>
        </LoadingContainer>
    </div>
    );
};

export default LostRevenue;
