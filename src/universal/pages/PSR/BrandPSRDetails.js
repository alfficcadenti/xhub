import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import h from './psrHelpers';
import DataTable from '../../components/DataTable';
import LineChartWrapper from '../../components/LineChartWrapper';
import moment from 'moment';
import './styles.less';

class BrandPSRDetails extends PureComponent {
    getDates = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            dates.push(moment().subtract(i, 'day').format('YYYY-MM-DD'));
        }
        return dates.reverse();
    }

    getLineData = (series = []) => {
        const dates = this.getDates();
        const keys = new Set();
        const data = dates.map((date) => {
            const result = {name: date};
            const lobs = h.listOfLOB(series);
            lobs.forEach((lob) => {
                keys.add(lob);
                const dayValue = h.findValuesByDate(h.psrValuesByLOB(series, lob), date);
                // eslint-disable-next-line no-undefined
                result[lob] = (dayValue && dayValue.successPercentage) || undefined;
            });
            return result;
        });
        return {data, keys: Array.from(keys)};
    }

    render() {
        const {data} = this.props;
        const dataForTable = h.formatDataForTable(h.psrValuesByDate(data, h.lastPSRAvailableDate(data)));
        const last7DaysDailyPSR = h.psrValuesByInterval(data, 'daily');
        const {data: lineData, keys: lineKeys} = this.getLineData(last7DaysDailyPSR);

        return (
            <div id="PSRDetails">
                <DataTable
                    data={dataForTable}
                    columns={['Line Of Business', 'Last 24 hours', 'Last 7 days', 'Last 28 days']}
                    paginated={false}
                />
                <LineChartWrapper data={lineData} keys={lineKeys} />
            </div>
        );
    }
}

BrandPSRDetails.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape())
};
export default BrandPSRDetails;