import React, {PureComponent} from 'react';
import h from './psrHelpers';
import PropTypes from 'prop-types';
import DataTable from '../../components/DataTable/index';
import ReactEcharts from 'echarts-for-react';
import './styles.less';

class BrandPSRDetails extends PureComponent {
    setChartOptions = (series = []) => (
        {
            legend: {
                data: series.map((x) => x.name)
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: series.map((x) => x.date),
            },
            markLine: {

            },
            yAxis: {
                name: 'Brand Daily PSR',
                nameLocation: 'middle',
                nameGap: 50,
                nameRotate: 90,
                type: 'value',
                min: Math.min(...series.map((x) => x.successPercentage)) - 3
            },
            series: [{
                name: 'PSR',
                data: series.map((x) => x.successPercentage),
                type: 'line',
                color: '#00008d'
            }]
        }
    )

    render() {
        const {data, dailyData} = this.props;
        const dataForTable = h.formatDataForTable(data);

        return (
            <div id="PSRDetails">
                <DataTable
                    data={dataForTable}
                    columns={['Line Of Business', 'Last 24 hours', 'Last 7 days', 'Last 28 days']}
                    paginated={false}
                />
                <ReactEcharts
                    option={this.setChartOptions(dailyData)}
                />
            </div>
        );
    }
}

BrandPSRDetails.propTypes = {
    data: PropTypes.array,
    dailyData: PropTypes.array,

};
export default BrandPSRDetails;