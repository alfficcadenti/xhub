import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {v1 as uuid} from 'uuid';
import './styles.less';


const ReferenceLabel = ({viewBox: {x}, annotation}) => {
    const {
        time,
        number,
        tags,
        serviceName,
        category,
        priority,
        status,
        url,
        id
    } = annotation;

    return (
        <foreignObject
            className="foreign-object"
            x={x - 5.5}
            y={-1}
        >
            <div className="annotation-tooltip">
                <div className="tooltip-body">
                    <p className="timestamp">{moment(time).format('YYYY-MM-DD hh:mm')}</p>
                    <div className="tooltip-wrapper">
                        {
                            category === 'deployment' ? <>
                                <span>{serviceName}</span>
                                <a href={`https://expedia.service-now.com/go.do?id=${number}`} target="_blank" className="incident-link">{number}</a>
                                <div className="tags">
                                    {tags && tags.map((t) => <div key={uuid()} className="tag"><span>{t}</span></div>)}
                                </div>
                            </> : <>
                                <span>{priority}</span>
                                <span>{status}</span>
                                <a href={url} target="_blank" className="incident-link">{id}</a>
                            </>
                        }
                    </div>
                </div>
            </div>
        </foreignObject>
    );
};

ReferenceLabel.propTypes = {
    annotation: PropTypes.shape().isRequired,
    viewBox: PropTypes.shape()
};

ReferenceLabel.defaultProps = {
    viewBox: {}
};

export default ReferenceLabel;
