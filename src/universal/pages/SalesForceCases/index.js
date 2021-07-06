import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const SalesForceCases = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            name="sales-force-cases"
            title="SalesForce Cases"
            url="https://opexhub-grafana.expedia.biz/d/olJ0j5g7z/sales-force-cases?orgId=1"
        />
    );
};

export default withRouter(SalesForceCases);
