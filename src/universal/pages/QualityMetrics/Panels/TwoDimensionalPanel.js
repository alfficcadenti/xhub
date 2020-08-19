import React, {useState, useEffect} from 'react';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import DataTable from '../../../components/DataTable';
import {PRIORITY_COLUMN_HEADERS} from '../constants';
import {formatTableData, processTwoDimensionalIssues} from '../utils';

const TwoDimensionalPanel = ({title, tickets, portfolios, data, dataKey, isLoading, error, isFixedHeight = false, fullWidth = false}) => {
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleClick = (d, project, priority) => {
            setModalData(processTwoDimensionalIssues(tickets, d, project, portfolios, priority));
            setIsModalOpen(true);
        };
        setChartData(formatTableData(data[dataKey], handleClick));
    }, [tickets, data, portfolios, dataKey]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    const renderTableFooter = (items = []) => (
        <div className="table-footer">
            <p className="text-left float-left">
                {'Grouped by: Priority'}
            </p>
            <p className="text-right float-right">
                {`Showing ${items.length - 1} of ${items.length - 1} statistics`}
            </p>
        </div>
    );

    return (
        <Panel
            title={title}
            isLoading={isLoading}
            error={error}
            isFixedHeight={isFixedHeight}
            isFullWidth={fullWidth}
        >
            <DataTable
                data={chartData}
                columns={['Project', 'p1', 'p2', 'p3', 'p4', 'p5', 'notPrioritized', 'totalTickets']}
                columnHeaders={PRIORITY_COLUMN_HEADERS}
                className="table-container"
                sortDisabled
                columnIcons
                renderFooter={renderTableFooter}
            />
            <ChartModal
                title={title}
                isOpen={isModalOpen}
                data={modalData}
                onClose={handleCloseModal}
            />
        </Panel>
    );
};

export default TwoDimensionalPanel;
