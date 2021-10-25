import React from 'react';
import DataTable from '@homeaway/react-data-table';
import {SVGIcon} from '@homeaway/react-svg';
import {SUCCESS__24, ALERT__24, ALERT_WARNING__24} from '@homeaway/svg-defs';
import './styles.less';
import github from './img/github.png';

const Status = () => {
    return (
        <div className="status-page-container">
            <h1 className="page-title">{'Status Page'}</h1>
            <DataTable
                headers={[{name: 'Service Name'}, {name: 'Endpoint'}, {name: 'Status'}]}
                rows={[
                    {cols: [<div><a href={'https://github.expedia.biz/eg-reo-opex/eg-fci-data-service'} target={'_blank'} >{'eg-fci-data-service'} </a> <img src={github} height="24" width="24" alt="github" title="github" /></div>,
                        <div>{'/v1/checkout-failures/sites'}</div>,
                        <div><SVGIcon className="success-icon" markup={SUCCESS__24}/></div>]},
                    {cols: [<div/>, <div>{'/v1/checkout-failures/error-categories'}</div>, <div><SVGIcon className="fail-icon" markup={ALERT__24}/></div>]},
                    {cols: [<div/>, <div>{'/v1/checkout-failures/error-codes'}</div>, <div> <SVGIcon className="warning-icon" markup={ALERT_WARNING__24} /></div>]},
                ]}
                colConfig={{flex: {0: 2, 1: 3, 2: 1}}}
            />
        </div>
    );
};


export default Status;

