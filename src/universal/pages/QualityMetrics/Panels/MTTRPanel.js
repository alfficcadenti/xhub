import React, {useState, useEffect} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import {PRIORITY_LABELS, PRIORITY_COLORS} from '../constants';
import {formatTTRData, findAndFormatTicket, mapPriority} from '../utils';

const MTTRPanel = ({title, info, tickets, panelData, dataKey}) => {
    const {data, isLoading, error, queries = []} = panelData;
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const formattedData = panelData.info && panelData.info.message === 'no data found'
            ? []
            : formatTTRData(data[dataKey]);
        setChartData(formattedData);
    }, [panelData, data, dataKey]);

    const getClickHandler = (priority) => (selected) => {
        if (selected && selected.payload) {
            const selectedTickets = selected.payload.tickets || [];
            const ticketDetails = selectedTickets
                .map((ticketId) => findAndFormatTicket(tickets, ticketId))
                .filter((details) => details && mapPriority(details.Priority) === priority);
            setModalData({
                data: ticketDetails,
                description: `Displaying defects with ${priority} priority`,
                columns: ['Portfolio', 'Key', 'Summary', 'Priority', 'Status', 'Resolution', 'Opened', 'Days to Resolve']
            });
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    return (
        <Panel
            title={title}
            info={info}
            queries={queries}
            isLoading={isLoading}
            error={error}
            isFullWidth
        >
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} cursor="pointer">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {PRIORITY_LABELS.map((p) => <Line key={p} dataKey={p} stroke={PRIORITY_COLORS[p]} activeDot={{onClick: getClickHandler(p)}} />)}
                </LineChart>
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

export default MTTRPanel;
