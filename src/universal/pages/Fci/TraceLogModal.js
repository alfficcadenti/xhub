import React, {useState, useEffect} from 'react';
// import ReactFlow from 'react-flow-renderer';
import {RadioGroup, RadioButton} from '@homeaway/react-form-components';
import Modal from '@homeaway/react-modal';
import {Navigation} from '@homeaway/react-navigation';
import DataTable from '../../components/DataTable';
import {getFilteredTraceData} from './utils';
import {TRACE_TABLE_COLUMNS} from './constants';

const SHOW_CHART = false;

const TraceLogModal = ({data, isOpen, onClose}) => {
    const [showOnlyErrors, setShowOnlyErrors] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const navLinks = [
        {id: 'table', label: 'Table', href: '/fci'},
        {id: 'chart', label: 'Chart', href: '/fci'}
    ];

    useEffect(() => {
        setFilteredData(getFilteredTraceData(data, showOnlyErrors));
    }, [data, showOnlyErrors]);

    const handleChoiceChange = (event) => {
        setShowOnlyErrors(event.target.value === 'true');
    };

    const renderTable = () => (
        <>
            <RadioGroup name="choice" ariaLabel="Table filter">
                <RadioButton
                    label="Full Log"
                    value="false"
                    checked={!showOnlyErrors}
                    onChange={handleChoiceChange}
                />
                <RadioButton
                    label="Errors Only"
                    value="true"
                    checked={showOnlyErrors}
                    onChange={handleChoiceChange}
                />
            </RadioGroup>
            <DataTable
                data={filteredData}
                columns={TRACE_TABLE_COLUMNS}
                rules={[{column: 'Error', setClass: (val) => val === 'true' ? 'error-cell' : 'success-cell'}]}
                paginated
            />
        </>
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
        setShowOnlyErrors(true);
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