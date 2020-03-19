import React from 'react';
import './TicketsInfo.less';


const TicketsInfo = () => (<div className="ticket-info-wrapper">
    <div className="ticket-info-column">
        <span className="ticket-info-header">{'COE tickets:'}</span>
        <ul className="ticket-info-list">
            <li><a>{'INC4695398'}</a></li>
            <li><a>{'INC4695398'}</a></li>
            <li><a>{'INC4695398'}</a></li>
        </ul>
    </div>
    <div className="ticket-info-column">
        <span className="ticket-info-header">{'RCA tickets:'}</span>
        <ul className="ticket-info-list">
            <li><a>{'INC4695398'}</a></li>
            <li><a>{'INC4695398'}</a></li>
            <li><a>{'INC4695398'}</a></li>
        </ul>
    </div>
</div>);

export default TicketsInfo;
