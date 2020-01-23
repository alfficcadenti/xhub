/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    LineChart
} from 'recharts';
import {createOpacityConfig} from '../../incidentsHelper';


const LostRevenue = ({lostRevenues, brands}) => {
    // const [opacity, setOpacity] = useState(null);

    // const opacityConfig = createOpacityConfig(brands);
    //
    // setOpacity(opacityConfig);
    //
    // const handleOnClick = (e) => {
    //     const {dataKey} = e;
    //     const toggleOpacity = (prop) => prop === 0.2 ? 1 : 0.2;
    //
    //     setOpacity({
    //         ...opacity,
    //         [dataKey]: toggleOpacity(opacity[dataKey])
    //     });
    // };

    return (<div id="lost-revenue">
        <LineChart
            width={1000}
            height={300}
            data={lostRevenues}
            marginTop={200}
        >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="weekInterval" />
            <YAxis width={100} />
            {/* <Legend onClick={handleOnClick}/>*/}
            <Legend />
            <Legend />
            {
                brands && brands.map((brand, i) => {
                    // return <Line type="monotone" dataKey={brand} stroke={`#${i}88${i}d8`} key={brand} strokeOpacity={opacity[brand]} />;
                    return <Line type="monotone" dataKey={brand} stroke={`#${i}88${i}d8`} key={brand} />;
                })
            }
        </LineChart>
    </div>
    );
};

export default LostRevenue;
