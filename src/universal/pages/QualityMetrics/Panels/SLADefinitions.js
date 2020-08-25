import React from 'react';
import Panel from '../Panel';
import DataTable from '../../../components/DataTable';
import {PRIORITY_COLUMN_HEADERS, SLA_COLUMNS} from '../constants';

const data = [{
    Priority: 'SLA',
    p1: '1 day',
    p2: '14 days',
    p3: '45 days',
    p4: '60 days',
    p5: '90 days'
}, {
    Priority: 'Nearing SLA',
    p1: '1 day',
    p2: '11 days',
    p3: '30 days',
    p4: '45 days',
    p5: '75 days'
}];

const SLADefinitions = () => (
    <Panel title="SLA Definitions" isFullWidth>
        <DataTable
            data={data}
            columns={SLA_COLUMNS}
            columnHeaders={PRIORITY_COLUMN_HEADERS}
            className="table-container"
            sortDisabled
            columnIcons
        />
    </Panel>
);

export default SLADefinitions;
