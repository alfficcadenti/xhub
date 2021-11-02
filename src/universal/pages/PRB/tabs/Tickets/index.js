import React from 'react';
import DataTable from '../../../../components/DataTable';

const Tickets = ({tickets = []}) => (
    <DataTable
        title={`Tickets (${tickets.length} ${tickets.length === 1 ? 'result' : 'results'})`}
        data={tickets}
        columns={['Ticket', 'Priority', 'Owning Org', 'Opened', 'Epic Name', 'RC Owner', 'RC Category', 'Status']}
        expandableColumns={['Linked Issues']}
        columnsInfo={{
            Ticket: (
                <div>
                    <b>{'Ticket'}</b><br />
                    {'Main Epic Jira ticket for a PRB follow-up ticket'}
                </div>
            )
        }}
        paginated
    />
);

export default Tickets;