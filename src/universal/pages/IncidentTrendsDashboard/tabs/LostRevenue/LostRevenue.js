import React, {useState} from 'react';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    LineChart
} from 'recharts';
import {createOpacityConfig, extractBrandNames, prepareBrandLossData} from '../../incidentsHelper';


const LostRevenue = ({filteredLostRevenues}) => {
    const [opacity, setOpacity] = useState(createOpacityConfig(extractBrandNames(filteredLostRevenues)) ? createOpacityConfig(extractBrandNames(filteredLostRevenues)) : {});

    const brands = extractBrandNames(filteredLostRevenues);
    const lostRevenues = prepareBrandLossData(filteredLostRevenues, brands);

    const handleOnClick = (e) => {
        const {dataKey} = e;
        const toggleOpacity = (prop) => prop === 0.2 ? 1 : 0.2;

        setOpacity({
            ...opacity,
            [dataKey]: toggleOpacity(opacity[dataKey])
        });
    };

    const renderChart = () => (
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
            {
                brands && brands.map((brand, i) => {
                    return <Line type="monotone" dataKey={brand} stroke={`#${i}88${i}d8`} key={brand} strokeOpacity={opacity[brand]} />;
                })
            }
        </LineChart>
    );

    return (<div id="lost-revenue">
        {
            (filteredLostRevenues && filteredLostRevenues.length) ?
                renderChart() :
                <p>{'No Results Found'}</p>
        }
    </div>
    );
};

export default LostRevenue;
