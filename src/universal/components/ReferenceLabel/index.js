import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {v1 as uuid} from 'uuid';
import {buildTicketLink} from '../../pages/utils';
import {DEPLOYMENT_ANNOTATION_CATEGORY} from '../../constants';
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
        url,
        brand
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
                    <p className="timestamp">{moment(time).format('YYYY-MM-DD HH:mm')}</p>
                    <div className="tooltip-wrapper">
                        {
                            category === DEPLOYMENT_ANNOTATION_CATEGORY ? <>
                                <span className="service-name">{serviceName}</span>
                                {buildTicketLink(number, brand)}
                                <div className="tags">
                                    {tags && tags.map((t) => <div key={uuid()} className="tag"><span>{t}</span></div>)}
                                </div>
                            </> : <>
                                <span>{priority}</span>
                                <span className="summary">{summary}</span>
                                <span>{status}</span>
                                {isImpulse ?
                                    <div>
                                        {buildTicketLink(id, null, url)}
                                        <div>
                                            <span>{'Revenue Loss:'}</span>
                                            <span>{typeof revLoss === 'string' ? 'NA' : `$${revLoss}`}</span>
                                        </div>
                                    </div>
                                    : buildTicketLink(id, brand)
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
