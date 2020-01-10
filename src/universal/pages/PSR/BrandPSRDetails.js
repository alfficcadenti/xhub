import React, {Component} from 'react';
import h from './psrHelpers'
import PropTypes from 'prop-types';
import DataTable from '../../components/DataTable/index';
import './styles.less';

class BrandPSRDetails extends Component {
    constructor(props) {
        super(props);
        this.state= {
            isOpen: false
        }
    }

    formatDataForTable = (data) => (
        h.listOfLOB(data).map(lob => {
            const daily = h.findPSRValueByInterval(h.psrValuesByLOB(data, lob),'daily')
            const weekly = h.findPSRValueByInterval(h.psrValuesByLOB(data, lob),'weekly')
            const monthly = h.findPSRValueByInterval(h.psrValuesByLOB(data, lob),'monthly')
            return {
                'Line Of Business': lob,
                'Last 24 hours': (daily && daily['successPercentage'].toFixed(2)+' %') || '',
                'Last 7 days': (weekly && weekly['successPercentage'].toFixed(2)+' %') || '',
                'Last 28 days': (monthly && monthly['successPercentage'].toFixed(2)+' %') || '',
            }
        })
    )
     
    
    render() {
        const {data} = this.props;
        const dataForTable = this.formatDataForTable(data);
        return (
            <div id='PSRDetails'>
                <DataTable
                    data={dataForTable}
                    columns={['Line Of Business','Last 24 hours','Last 7 days','Last 28 days']}
                    paginated={false}
                />
            </div>
        );
    }
}

BrandPSRDetails.propTypes = {
    data: PropTypes.array
};
export default BrandPSRDetails;