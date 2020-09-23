import React, {useState, useEffect} from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import {findAndFormatTicket} from '../utils';
import {NOT_PRIORITIZED_LABEL} from '../constants';
import {CHART_COLORS} from '../../../constants';

const PiePanel = ({title, info, tickets, dataKey, data, isLoading, error}) => {
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const slices = Object.entries(data[dataKey] || {})
            .map(([name, stats]) => ({name, counts: stats.totalTickets, tickets: stats.ticketIds}));
        slices.sort((a, b) => {
            if (a.name === NOT_PRIORITIZED_LABEL) {
                return 1;
            } else if (b.name === NOT_PRIORITIZED_LABEL) {
                return -1;
            }
            return (a.name || '').localeCompare(b.name);
        });
        setChartData(slices);
    }, [tickets, dataKey, data]);

    const getClickHandler = (cellName, cellTickets) => () => {
        const ticketDetails = cellTickets
            .map((ticketId) => findAndFormatTicket(tickets, ticketId))
            .filter((ticket) => cellTickets.includes(ticket.id));
        setModalData({
            data: ticketDetails,
            description: `Displaying ${cellName} open bugs`,
            columns: ['Portfolio', 'Key', 'Summary', 'Priority', 'Status', 'Resolution', 'Opened', 'Days to Resolve']
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    return (
        <Panel title={title} info={info} isLoading={isLoading} error={error}>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart cursor="pointer">
                    <Tooltip />
                    <Legend />
                    <Pie data={chartData} dataKey="counts" outerRadius={100}>
                        {chartData.map((cell, idx) => <Cell key={cell.name} fill={CHART_COLORS[idx]} onClick={getClickHandler(cell.name, cell.tickets)} />)}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <ChartModal
                title={title}
                isOpen={isModalOpen}
                data={modalData}
                onClose={handleCloseModal}
            />
        </Panel>
    );
};

export default PiePanel;
