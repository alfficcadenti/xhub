import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {v1 as uuid} from 'uuid';
import {buildTicketLink} from '../../pages/utils';
import {DEPLOYMENT_ANNOTATION_CATEGORY, AB_TESTS_ANNOTATION_CATEGORY} from '../../constants';
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
        brand,
        abTestDetails
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
                            (() => {
                                switch (category) {
                                    case DEPLOYMENT_ANNOTATION_CATEGORY:
                                        return (<>
                                            <span className="service-name">{serviceName}</span>
                                            {buildTicketLink(number, brand)}
                                            <div className="tags">
                                                {tags && tags.map((t) => <div key={uuid()} className="tag"><span>{t}</span></div>)}
                                            </div>
                                        </>);
                                    case AB_TESTS_ANNOTATION_CATEGORY:
                                        return (<>
                                            {buildTicketLink(number, brand)}
                                            <a className="experiment-link" href={`https://egtnl.prod.expedia.com/experiment/${abTestDetails.experimentId}`} target="_blank">{abTestDetails.experimentName}</a>
                                            <span className="experiment-status">{`status: ${abTestDetails.status}`}</span>
                                            <span className="experiment-owner">{abTestDetails.owner}</span>
                                        </>);
                                    default:
                                        return (<>
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
                                        </>);
                                }
                            })()
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
