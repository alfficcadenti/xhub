import React from 'react';
import Modal from '@homeaway/react-modal';
import DataTable from '../../../components/DataTable';
import './styles.less';

const ChartModal = ({title = '', isOpen = false, data = {}, onClose}) => {
    return (
        <Modal
            id="chart-modal"
            className="chart-modal"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="modal-title">{title}</div>
            {data.description && <div className="modal-description">{data.description}</div>}
            <DataTable
                data={data.data || []}
                columns={['Portfolio', 'Key', 'Summary', 'Priority', 'Status', 'Resolution', 'Opened']}
                paginated
            />
        </Modal>
    );
};

export default ChartModal;
