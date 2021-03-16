import React from 'react';
import moment from 'moment';

const AnomalyLabel = ({viewBox: {x}, anomaly, setAnomalyTableData, category}) => {
    const getAnomalyType = () => {
        if (category === 'Anomaly Detected') {
            return 'detected';
        } else if (category === 'Anomaly Recovered') {
            return 'recovered';
        }
        return 'upstream';
    };
    const anomalyType = getAnomalyType();
    return (
        <foreignObject
            className="foreign-object"
            x={x - 5.5}
            y={-5}
            width={10}
            height={10}
        >
            <div className={`annotation-tooltip anomaly-impulse ${anomalyType}`}>
                <div className="tooltip-body">
                    <p className="timestamp">{`${moment(anomaly.time).format('YYYY-MM-DD HH:mm')} ${moment().tz(moment.tz.guess()).format('z')}`}</p>
                    <div className="tooltip-wrapper">
                        {anomaly.category}
                        <a href="#" onClick={() => setAnomalyTableData([anomaly])}>{'More Details'}</a>
                    </div>
                </div>
            </div>
        </foreignObject>
    );
};

AnomalyLabel.defaultProps = {
    viewBox: {}
};

export default AnomalyLabel;
