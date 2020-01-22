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

  const filterByBrand = (data = [], brandName) => data.filter(item => item.brand === brandName);

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

  const extractBrandNames = data => data
    .map(item => item.brand)
    .filter((brand, i, brands) => brands.indexOf(brand) === i);

  const prepareDataForChart = (data, brands) => {
    const [lowerMarginDateValue,  maxMarginDateValue] = helpers.getMarginDateValues(data);
    const weekIntervals = helpers.weeklyRange(lowerMarginDateValue, maxMarginDateValue);

    // sum up lost revenue values for each brand (per each week interval)
    // make recharts-like data to feed into chart

    return weekIntervals.reduce((prev, weekInterval) => {
      const incidentsPerInterval = helpers.incidentsOfTheWeek(data, moment(weekInterval).week());

      const newMetricPoint = brands.reduce((prev, brand) => ({
        ...prev,
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
          throw new Error;
        }
        return resp.json();
      })
      .then((incidents) => {
        const brands = extractBrandNames(incidents);
        const opacityConfig = createOpacityConfig(brands);
        setOpacity(opacityConfig);
        setBrands(brands);
        const readyData = prepareDataForChart(incidents, brands);
        setLostRevenues(readyData);
        setIsLoading(false);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
      })
  }, []);

  return {
    lostRevenues,
    brands,
    opacity,
    isLoading
  };
}

const LostRevenue = () => {
  const {opacity, lostRevenues, brands, isLoading} = useRevenueLoss();
  const [legendFill, setLegendFill] = useState(opacity);

  const handleOnClick = (e) => {
    const { dataKey } = e;
    const toggleOpacity = (prop) => prop === 0.2 ? 1 : 0.2;

    setLegendFill({
      ...legendFill,
      [dataKey]: toggleOpacity(legendFill[dataKey])
    });
  };

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
              return <Line type="monotone" dataKey={brand} stroke={`#${i}88${i}d8`} key={brand} strokeOpacity={opacity[brand]} />
            })
          }
        </LineChart>
      </LoadingContainer>
    </div>
  );
};

export default LostRevenue;
