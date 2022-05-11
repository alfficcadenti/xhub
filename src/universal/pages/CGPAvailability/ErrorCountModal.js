import React from 'react';
import Modal from '@homeaway/react-modal';
import LineChartWrapper from '../../components/LineChartWrapper';

const ErrorCountModal = ({isOpen, onClose, app, data}) =>
    (
        <Modal
            id="errors-modal"
            className="errors-modal"
            isOpen={isOpen}
            onClose={onClose}
        >
            <h3>{app}</h3>
            {data?.length &&
                <LineChartWrapper
                    title={'5xx errors over Time'}
                    helpText="Daily error count for the selected application"
                    data={data}
                    keys={['5xx Errors']}
                    height={360}
                />
            }
        </Modal>
    );

export default ErrorCountModal;
