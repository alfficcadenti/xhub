import React, {useState, useEffect} from 'react';
import Modal from '@homeaway/react-modal';
import {SVGIcon} from '@homeaway/react-svg';
import {NEW_WINDOW__16} from '@homeaway/svg-defs';
import DataTable from '../../components/DataTable';
import HelpText from '../../components/HelpText/HelpText';
import {getFilteredTraceData} from './utils';
import {TRACE_TABLE_COLUMNS} from './constants';

const TraceLogModal = ({data, isOpen, onClose}) => {
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(getFilteredTraceData(data));
    }, [data]);

    const renderTable = () => (
        <>
            <a target="_blank" rel="noopener noreferrer" className="ext-link" href={`https://bex.haystack.exp-prod.net/search?query_1.traceId=${data.traceId}`}>
                {'Haystack'} <SVGIcon usefill markup={NEW_WINDOW__16} />
            </a>
            <a target="_blank" rel="noopener noreferrer" className="ext-link" href={data.recordedSessionUrl}>
                {'Glassbox'} <SVGIcon usefill markup={NEW_WINDOW__16} />
            </a>
            <HelpText className="help-text" text={'Not all sessions are recorded'} placement="bottom" />
            <DataTable
                title={'Error Traces'}
                info={'See Haystack for full error log.'}
                data={filteredData}
                columns={TRACE_TABLE_COLUMNS}
                rules={[{column: 'Error', setClass: (val) => val === 'true' ? 'error-cell' : 'success-cell'}]}
                paginated
            />
        </>
    );

    return (
        <Modal
            title={`Trace Log (ID=${data.traceId})`}
            id="chart-modal"
            className="chart-modal"
            isOpen={isOpen}
            onClose={onClose}
        >
            {renderTable()}
        </Modal>
    );
};

export default TraceLogModal;