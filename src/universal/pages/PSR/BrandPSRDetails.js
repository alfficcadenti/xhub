import React, {PureComponent} from 'react';
import h from './psrHelpers';
import PropTypes from 'prop-types';
import DataTable from '../../components/DataTable/index';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import './styles.less';

class BrandPSRDetails extends PureComponent {
    chartOptions = (series = []) => {
        let dates = [];
        for (let i = 0; i < 7; i++) {
            dates.push(moment().subtract(i, 'day').format('YYYY-MM-DD'));
        }
        dates = dates.reverse();

        const data = h.listOfLOB(series).map((lob) => {
            let last7daysValue = [];
            dates.forEach((date) => {
                const dayValue = h.findValuesByDate(h.psrValuesByLOB(series, lob), date);
                // eslint-disable-next-line no-undefined
                last7daysValue.push((dayValue && dayValue.successPercentage) || undefined);
            });

            return {
                name: lob,
                type: 'line',
                data: last7daysValue,
                color: lob === 'PSR' ? '#00c' : '',
                lineStyle: {width: lob === 'PSR' ? 3 : 2}

            };
        });
        const legend = h.listOfLOB(series);

        return {
            legend: {
                data: legend
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: dates
            },
            yAxis: {
                name: 'Brand Daily PSR',
                nameLocation: 'middle',
                nameGap: 50,
                nameRotate: 90,
                type: 'value',
                min: (Math.min(...series.map((x) => x.successPercentage)) - 2).toFixed()
            },
            series: data
        };
    }

    render() {
        const {data} = this.props;
        const dataForTable = h.formatDataForTable(h.psrValuesByDate(data, h.lastPSRAvailableDate(data)));
        const last7DaysDailyPSR = h.psrValuesByInterval(data, 'daily');

        return (
            <div id="PSRDetails">
                <DataTable
                    data={dataForTable}
                    columns={['Line Of Business', 'Last 24 hours', 'Last 7 days', 'Last 28 days']}
                    paginated={false}
                />
                <ReactEcharts
                    option={this.chartOptions(last7DaysDailyPSR)}
                    key={Math.random()}
                />
            </div>
        );
    }
}

BrandPSRDetails.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape())
};
export default BrandPSRDetails;