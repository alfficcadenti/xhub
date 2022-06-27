import React from 'react';
import Modal from '@homeaway/react-modal';
import LineChartWrapper from '../../components/LineChartWrapper';
import moment from 'moment';

const availability = (reqs, errs) => Number.isFinite(isNaN((reqs - errs) / reqs) ? '' : ((reqs - errs) / reqs)) ? (((reqs - errs) / reqs) * 100).toFixed(2) : '';

const OverallAvailabilityModal = ({isOpen, onClose, data = {}, dateTimeFormat}) => {
    const dataForChart = Object.keys(data)
        .map((k) =>
            (
                availability(data[k].requestCount, data[k].errorCount) &&
                {
                    name: moment(k).format(dateTimeFormat),
                    availability: availability(data[k].requestCount, data[k].errorCount)
                }
            )
        );
    const minValue = Math.min(...dataForChart.map((x) => x?.availability));
    return (
        <Modal
            id="overall-availability-modal"
            className="overall-availability-modal"
            isOpen={isOpen}
            onClose={onClose}
        >
            {dataForChart?.length &&
                <LineChartWrapper
                    title={'Overall Availability over Time'}
                    helpText="Overall Availability for the selected period"
                    data={dataForChart}
                    keys={['availability']}
                    height={360}
                    allowDecimals
                    minChartValue={minValue}
                    maxChartValue={100}
                />
            }
        </Modal>
    );
};


export default OverallAvailabilityModal;
