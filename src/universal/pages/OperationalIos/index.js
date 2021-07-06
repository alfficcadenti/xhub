import React from 'react';
import {withRouter} from 'react-router-dom';
import './styles.less';
import GrafanaDashboard from '../../components/GrafanaDashboard';

const OperationalIos = ({selectedBrands, availableBrands}) => {
    return (
        <GrafanaDashboard
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            name="operational-ios"
            title="Operational iOS"
            url="https://opexhub-grafana.expedia.biz/d/pdNQAz_Mz/cortina-ios?orgId=1&refresh=30m&var-LOCALE=All&var-MARKETINGCHANNEL=All&var-PLATFORM=Mob%20::%20TabWeb&var-PLATFORM=Mob%20::%20Web&var-POS=All&var-IsKES=All&var-DATACENTER=aws.us-east-1.unknown&theme=light"
        />
    );
};

export default withRouter(OperationalIos);
