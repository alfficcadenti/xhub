import React, {useState, useEffect} from 'react';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import DataTable from '../../../components/DataTable';
import {PRIORITY_COLUMN_HEADERS} from '../constants';
import {formatTableData, groupDataByPillar, processTwoDimensionalIssues} from '../utils';

const TwoDimensionalPanel = ({title, info, tickets, portfolios, data, dataKey, isLoading, error, fullWidth = false, groupByPillar}) => {
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleClick = (d, project, priority) => {
            setModalData(processTwoDimensionalIssues(tickets, d, project, portfolios, priority));
            setIsModalOpen(true);
        };
        const selectedData = groupByPillar
            ? groupDataByPillar(data[dataKey], portfolios)
            : data[dataKey];
        setChartData(formatTableData(selectedData, handleClick));
    }, [tickets, data, portfolios, dataKey, groupByPillar]);

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
            info={info}
            isLoading={isLoading}
            error={error}
            isFixedHeight
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
