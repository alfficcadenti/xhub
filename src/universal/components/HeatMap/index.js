import React from 'react';
import {HeatMapGrid} from 'react-grid-heatmap';
import NoResults from '../NoResults';
import PropTypes from 'prop-types';
import moment from 'moment';
import {defineColorByValue, formattedValue} from './utils';


const renderHeatMap = (data, yLabels, xLabels) => (<div
    style={{
        width: '100%'
    }}
>
    <HeatMapGrid
        data={data}
        xLabels={xLabels}
        yLabels={yLabels}
        cellRender={(x, y, value) => (
            <div
                style={{backgroundColor: defineColorByValue(value)}}
                title={`${yLabels[x]} on ${xLabels[y]} = ${value}`}
            >
                {formattedValue(value)}
            </div>
        )}
        xLabelsStyle={() => ({
            color: '#555',
            fontSize: '.7rem',
            transform: 'rotate(-80deg)',
        })}
        yLabelsStyle={() => ({
            fontSize: '.8rem',
            color: '#555',
            fontWeight: 'bold',
        })}
        cellStyle={(_x, _y, ratio) => ({
            backgroundColor: ratio ? 'rgb(255, 191, 0,0.3)' : 'rgb(255, 255, 255)',
            fontSize: '.7rem',
            color: 'rgb(0, 0, 0)'
        })}
        cellHeight="3rem"
        xLabelsPos="top"
        yLabelsPos="left"
        square
    />
</div>);

const HeatMap = ({data = [], dataLabel = '', yLabel = '', xLabel = '', dataArrayName = ''}) => {
    if (data?.length && dataArrayName && dataLabel && yLabel && xLabel) {
        const yLabels = data.map((item) => item[yLabel]);
        const xLabels = data[0][dataArrayName].map((item) => xLabel === 'timestamp' ? moment(item[xLabel]).format('ll') : item[xLabel]);
        const dataForHeatmap = data.map((app) => app[dataArrayName].map((item) => item[dataLabel]));

        return (
            <div className="heatmap-container">
                {renderHeatMap(dataForHeatmap, yLabels, xLabels)}
            </div>
        );
    }
    return (<NoResults />);
};

HeatMap.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    dataLabel: PropTypes.string,
    dataArrayName: PropTypes.string,
    yLabels: PropTypes.string,
    xLabels: PropTypes.string
};
export default HeatMap;
