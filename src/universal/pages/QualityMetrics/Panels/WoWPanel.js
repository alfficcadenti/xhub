import React, {useState, useEffect} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import {CHART_COLORS} from '../../../constants';
import {findAndFormatTicket, formatWoWData} from '../utils';

const WoWPanel = ({tickets, dataUrl}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const title = 'Created WoW and Resolved WoW';

    useEffect(() => {
        const fetchData = () => {
            setIsLoading(true);
            setError(null);
            fetch(dataUrl)
                .then((data) => data.json())
                .then((response) => {
                    const rawData = response.data.wowIssues;
                    const data = rawData.info && rawData.info.message === 'no data found'
                        ? []
                        : formatWoWData(rawData);
                    setChartData(data);
                    setIsLoading(false);
                })
                .catch((e) => {
                    setChartData([]);
                    setError(e.message);
                    setIsLoading(false);
                });
        };
        fetchData();
    }, [tickets, dataUrl]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    const getClickHandler = (ticketsKey) => (selected) => {
        if (selected && selected.payload) {
            const selectedTickets = selected.payload[ticketsKey] || [];
            const ticketDetails = selectedTickets
                .map((ticketId) => findAndFormatTicket(tickets, ticketId))
                .filter((details) => details);
            setModalData({
                data: ticketDetails,
                description: `Displaying ${ticketsKey} in the week of ${selected.payload.date}`,
                columns: ['Portfolio', 'Key', 'Summary', 'Priority', 'Status', 'Resolution', 'Opened', 'Days to Resolve']
            });
            setIsModalOpen(true);
        }
    };

    return (
        <Panel
            title={title}
            info="Number of defects created vs resolved and the difference week over week (bucked by week)"
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
                    <Line dataKey="created" stroke={CHART_COLORS[0]} activeDot={{onClick: getClickHandler('created tickets')}} />
                    <Line dataKey="resolved" stroke={CHART_COLORS[2]} activeDot={{onClick: getClickHandler('resolved tickets')}} />
                    <Line dataKey="diff" stroke={CHART_COLORS[3]} activeDot={{onClick: getClickHandler('all tickets')}} />
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

export default WoWPanel;
