import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactGaugeChart from 'react-gauge-chart';

class GaugeChart extends PureComponent {

    render() {
        const {
            title,
            value
        } = this.props;

        return (
            <ReactGaugeChart 
                id={title}
                nrOfLevels={20}
                percent={value/100} 
                style={{height: 150, width: 250}}
                colors={["#FF5F6D", "#00FF00"]}
                textColor={'#000000'}
            />
        )
    }
}

GaugeChart.defaultProps = {
    title: '',
    value: 0,
};

GaugeChart.propTypes = {
    title: PropTypes.string,
    value: PropTypes.number
};

export default GaugeChart;