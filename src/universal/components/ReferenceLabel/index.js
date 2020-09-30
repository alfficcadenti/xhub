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

    const getLink = (annotationType, link) => {
        let hrefLink;

        if (annotationType === 'deployment' || !link.includes('-')) {
            hrefLink = `https://expedia.service-now.com/go.do?id=${link}`;
        } else {
            hrefLink = `https://jira.homeawaycorp.com/browse/${link}`;
        }

        return (<a href={hrefLink} target="_blank">{link}</a>);
    };

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
                                {getLink(category, number)}
                                <div className="tags">
                                    {tags && tags.map((t) => <div key={uuid()} className="tag"><span>{t}</span></div>)}
                                </div>
                            </> : <>
                                <span>{priority}</span>
                                <span className="summary">{summary}</span>
                                <span>{status}</span>
                                {isImpulse ?
                                    <div>
                                        <a href={url} target="_blank">{id}</a>
                                        <div>
                                            <span>{'Revenue Loss:'} </span><span>{typeof revLoss === 'string' ? 'NA' : `$${revLoss}`}</span>
                                        </div>
                                    </div>
                                    : getLink(category, id)
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
