import React, {useState, useEffect} from 'react';
import Modal from '@homeaway/react-modal';
import DataTable from '../../../components/DataTable';
import LoadingContainer from '../../../components/LoadingContainer';
import {OPXHUB_SUPPORT_CHANNEL} from '../../../constants';
import {checkResponse} from '../../utils';
import {mapTicketDetails} from '../utils';
import './styles.less';


export const TICKET_DETAILS_COLUMNS = [
    'Number',
    'Priority',
    'Title',
    'Time To Detect',
    'Time To Know',
    'Time To Fix',
    'Time To Restore'
];

const TicketDetailsModal = ({isOpen, onClose, onBack, currentL, currentClickedOrg}) => {
    const [ticketDetails, setTicketDetails] = useState([]);
    const [isLoadingTicketDetails, setIsLoadingTicketDetails] = useState(false);
    const [ticketDetailsError, setTicketDetailsError] = useState();

    useEffect(() => {
        setIsLoadingTicketDetails(true);
        setTicketDetailsError();

        fetch(`/v1/org-metrics/business-owner-type/p1/${currentL}/${currentClickedOrg}`)
            .then(checkResponse)
            .then((response) => {
                setTicketDetails(response);
            })
            .catch((err) => {
                setTicketDetailsError('Failed to retrieve ticket details data. Try refreshing the page. '
                    + `If the problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`);
                // eslint-disable-next-line no-console
                console.error(err);
            })
            .finally(() => setIsLoadingTicketDetails(false));
    }, [isOpen]);

    return (
        <Modal
            id="ticket-details-modal"
            className="ticket-details-modal"
            isOpen={isOpen}
            onClose={() => onClose()}
        >
            <LoadingContainer isLoading={isLoadingTicketDetails} error={ticketDetailsError}>
                <div
                    className="modal-link back-btn"
                    onClick={onBack}
                    onKeyUp={(e) => e.key === 'Enter' && onBack()}
                    role="button"
                    tabIndex={0}
                >
                    {'Back'}
                </div>
                <div className="ticket-details-container">
                    <DataTable
                        title={`${currentClickedOrg} Details`}
                        data={mapTicketDetails(ticketDetails)}
                        columns={TICKET_DETAILS_COLUMNS}
                        paginated
                    />
                </div>
            </LoadingContainer>
        </Modal>
    );
};

export default TicketDetailsModal;
