import React, {useState} from 'react';
// import ReactFlow from 'react-flow-renderer';
import Modal from '@homeaway/react-modal';
import {Navigation} from '@homeaway/react-navigation';
import DataTable from '../../components/DataTable';
import {TRACE_TABLE_COLUMNS} from './constants';

const SHOW_CHART = false;

const TraceLogModal = ({data, isOpen, onClose}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navLinks = [
        {id: 'table', label: 'Table', href: '/fci'},
        {id: 'chart', label: 'Chart', href: '/fci'}
    ];

    const renderTable = () => (
        <DataTable
            data={(data.data || []).sort((a, b) => String(b.Error).localeCompare(a.Error))}
            columns={TRACE_TABLE_COLUMNS}
            rules={[{column: 'Error', setClass: (val) => val === 'true' ? 'error-cell' : 'success-cell'}]}
            // expandableColumns={['Traces']}
            paginated
        />
    );

    // const renderChart = () => (
    //     <div className="flowchart-container">
    //         <ReactFlow
    //             elements={getElements(data.data)}
    //             nodesConnectable={false}
    //         />
    //     </div>
    // );

    const handleOnClose = () => {
        onClose();
        setActiveIndex(0);
    };

    return (
        <Modal
            title={data.title}
            id="chart-modal"
            className="chart-modal"
            isOpen={isOpen}
            onClose={handleOnClose}
        >
            {SHOW_CHART && (
                <Navigation
                    noMobileSelect
                    activeIndex={activeIndex}
                    links={navLinks}
                    onLinkClick={(e, activeLinkIndex) => setActiveIndex(activeLinkIndex)}
                />
            )}
            {/* {activeIndex ? renderChart() : renderTable()} */}
            {renderTable()}
        </Modal>
    );
};

export default TraceLogModal;