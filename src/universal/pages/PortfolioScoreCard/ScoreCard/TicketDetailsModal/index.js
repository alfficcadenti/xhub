import React, {useState, useEffect} from 'react';
import Modal from '@homeaway/react-modal';
import DataTable from '../../../../components/DataTable';
import LoadingContainer from '../../../../components/LoadingContainer';
import {FETCH_FAILED_MSG} from '../../../../constants';
import {checkResponse} from '../../../utils';
import {mapTicketDetails} from '../../utils';
import {TICKET_DETAILS_COLUMNS, TICKET_DETAILS_RULES, TICKET_DETAILS_INFO} from '../constants';
import './styles.less';


const TicketDetailsModal = ({isOpen, onClose, start, end, data}) => {
    const [ticketDetails, setTicketDetails] = useState([]);
    const [isLoadingTicketDetails, setIsLoadingTicketDetails] = useState(false);
    const [ticketDetailsError, setTicketDetailsError] = useState();

    useEffect(() => {
        const {priority, org, level} = data;
        setIsLoadingTicketDetails(true);
        setTicketDetailsError();
        if (isOpen && org) {
            fetch(`/v1/org-metrics/business-owner-type/${priority}/${level}/${org}?from_date=${start}&to_date=${end}`)
                .then(checkResponse)
                .then((response) => setTicketDetails(response))
                .catch(() => setTicketDetailsError(FETCH_FAILED_MSG))
                .finally(() => setIsLoadingTicketDetails(false));
        }
    }, [isOpen, start, end, data]);

    return (
        <Modal
            id="ticket-details-modal"
            className="ticket-details-modal"
            isOpen={isOpen}
            onClose={onClose}
        >
            <LoadingContainer isLoading={isLoadingTicketDetails} error={ticketDetailsError}>
                <div className="ticket-details-container">
                    <DataTable
                        title={`${data.org} - ${data.priority.toUpperCase()} Tickets`}
                        data={mapTicketDetails(ticketDetails)}
                        columns={TICKET_DETAILS_COLUMNS}
                        columnsInfo={TICKET_DETAILS_INFO}
                        rules={TICKET_DETAILS_RULES}
                        paginated
                    />
                </div>
            </LoadingContainer>
        </Modal>
    );
};

export default TicketDetailsModal;
