import React, {PureComponent} from 'react';
import h from './psrHelpers'
import PropTypes from 'prop-types';
import DataTable from '../../components/DataTable/index';
import './styles.less';

class BrandPSRDetails extends PureComponent {
    render() {
        const {data} = this.props;
        const dataForTable = h.formatDataForTable(data);
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