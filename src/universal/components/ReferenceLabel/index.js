import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {v1 as uuid} from 'uuid';
import './styles.less';


const ReferenceLabel = ({viewBox: {x}, annotation, isImpulse = false}) => {
    const {
        time,
        number,
        tags,
        serviceName,
        category,
        priority,
        status,
        id,
        revLoss,
        summary,
        url
    } = annotation;

    return (
        <foreignObject
            className="foreign-object"
            x={x - 5.5}
            y={-115}
            width={10}
            height={120}
        >
            <div className={`annotation-tooltip ${isImpulse ? 'incidents-impulse' : category}`}>
                <div className="tooltip-body">
                    <p className="timestamp">{moment(time).format('YYYY-MM-DD hh:mm')}</p>
                    <div className="tooltip-wrapper">
                        {
                            category === 'deployment' ? <>
                                <span className="service-name">{serviceName}</span>
                                <a href={`https://expedia.service-now.com/go.do?id=${number}`} target="_blank" className="incident-link">{number}</a>
                                <div className="tags">
                                    {tags && tags.map((t) => <div key={uuid()} className="tag"><span>{t}</span></div>)}
                                </div>
                            </> : <>
                                <span>{priority}</span>
                                <span className="summary">{summary}</span>
                                <span>{status}</span>
                                {isImpulse ?
                                    <div><a href={url} target="_blank" className="incident-link">{id}</a>
                                        <div>
                                            <span>{'Revenue Loss:'} </span><span>{typeof revLoss === 'string' ? 'NA' : `$${revLoss}`}</span>
                                        </div>
                                    </div>
                                    :
                                    <a href={`https://jira.homeawaycorp.com/browse/${id}`} target="_blank" className="incident-link">{id}</a>
                                }
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
