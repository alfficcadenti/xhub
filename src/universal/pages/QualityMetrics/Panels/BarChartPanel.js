import React, {useState, useEffect} from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Panel from '../Panel';
import ChartModal from '../ChartModal';
import {PRIORITY_LABELS, PRIORITY_COLORS} from '../constants';
import {formatBarChartData, findAndFormatTicket, mapPriority} from '../utils';

const BarChartPanel = ({title, info, tickets, panelData, dataKey, type}) => {
    const {data, isLoading, error, queries} = panelData;
    const [chartData, setChartData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [hiddenKeys, setHiddenKeys] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    // eslint-disable-next-line complexity
    useEffect(() => {
        const formattedData = (panelData?.info?.message === 'no data found')
            ? []
            : formatBarChartData(data[dataKey] || []);
        setChartData(formattedData);
    }, [tickets, data, panelData, dataKey, type]);

    const getBarClickHandler = (priority) => (selectedBar) => {
        if (selectedBar) {
            const selectedTickets = selectedBar.tickets;
            const ticketDetails = selectedTickets
                .map((ticketId) => findAndFormatTicket(tickets, ticketId))
                .filter((details) => details && mapPriority(details.Priority) === priority);
            setModalData({
                data: ticketDetails,
                description: `Displaying defects with ${priority} priority`
            });
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    const handleLegendClick = (e) => {
        if (e && e.dataKey) {
            const nextHiddenBars = {...hiddenKeys};
            nextHiddenBars[e.dataKey] = !hiddenKeys[e.dataKey];
            setHiddenKeys(nextHiddenBars);
        }
    };

    const renderChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} cursor="pointer">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend onClick={handleLegendClick} cursor="pointer" />
                <Legend />
                {PRIORITY_LABELS.map((p) => <Bar key={p} dataKey={p} stackId="a" fill={PRIORITY_COLORS[p]} hide={hiddenKeys[p]} onClick={getBarClickHandler(p)} />)}
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <Panel
            title={title}
            isLoading={isLoading}
            error={error}
            info={info}
            queries={queries}
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
