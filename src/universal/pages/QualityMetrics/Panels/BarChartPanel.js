import React, {useState, useEffect} from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import {PRIORITY_LABELS, PRIORITY_COLORS} from '../constants';
import {formatBarChartData, findAndFormatTicket, mapPriority} from '../utils';

const BarChartPanel = ({title, tickets, dataUrl, dataKey}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            setIsLoading(true);
            setError(null);
            fetch(dataUrl)
                .then((data) => data.json())
                .then((response) => {
                    const rawData = response.data[dataKey] || {};
                    const data = rawData.info && rawData.info.message === 'no data found'
                        ? []
                        : formatBarChartData(rawData);
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
    }, [tickets, dataUrl, dataKey]);

    const getBarClickHandler = (priority) => (selectedBar) => {
        if (selectedBar) {
            const selectedTickets = selectedBar.tickets;
            const ticketDetails = selectedTickets
                .map((ticketId) => findAndFormatTicket(tickets, ticketId))
                .filter((details) => details && mapPriority(details.Priority) === priority);
            setModalData({data: ticketDetails, description: `Displaying defects with ${priority} priority`});
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    const renderChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} cursor="pointer">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {PRIORITY_LABELS.map((p) => <Bar key={p} dataKey={p} stackId="a" fill={PRIORITY_COLORS[p]} onClick={getBarClickHandler(p)} />)}
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <Panel
            title={title}
            isLoading={isLoading}
            error={error}
            info="Displaying defects with status that is not 'Done', 'Closed', 'Resolved', or 'Archived'"
            isFixedHeight
        >
            {chartData.length ? renderChart() : <div className="chart-message">{'No Results Found'}</div>}
            <ChartModal
                title={title}
                isOpen={isModalOpen}
                data={modalData}
                onClose={handleCloseModal}
            />
        </Panel>
    );
};

export default BarChartPanel;
