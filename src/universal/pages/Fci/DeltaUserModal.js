import React from 'react';
import Modal from '@homeaway/react-modal';
import DataTable from '../../components/DataTable';
import LoadingContainer from '../../components/LoadingContainer';
import {DELTA_USERS_TABLE_COLUMNS} from './constants';


const DeltaUserModal = ({deltaUsersData, isOpen, onClose, isLoading, error}) => {
    const renderDeltaUserTable = () => (
        <div className="log-container">
            <DataTable
                title={`Delta Users (${deltaUsersData.length} results)`}
                data={deltaUsersData}
                columns={DELTA_USERS_TABLE_COLUMNS}
                paginated
                enableColumnDisplaySettings
                enableTextSearch={false}
            />
        </div>
    );

    const handleOnClose = () => {
        onClose();
    };

    return (
        <Modal
            id="delta-user-modal"
            className="delta-user-modal"
            isOpen={isOpen}
            onClose={handleOnClose}
        >
            <LoadingContainer isLoading={isLoading} error={error}>
                {renderDeltaUserTable()}
            </LoadingContainer>
        </Modal>
    );
};

export default DeltaUserModal;
