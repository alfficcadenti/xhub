import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {v1 as uuid} from 'uuid';
import {buildTicketLink} from '../../pages/utils';
import {DEPLOYMENT_ANNOTATION_CATEGORY, AB_TESTS_ANNOTATION_CATEGORY} from '../../constants';
import './styles.less';


const ReferenceLabel = ({viewBox: {x}, annotation, isImpulse = false, setTableData}) => {
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

    const renderDeploymentLabel = () => (
        <>
            <span className="service-name">{serviceName}</span>
            {buildTicketLink(number, brand)}
            <div className="tags">
                {tags && tags.map((t) => <div key={uuid()} className="tag"><span>{t}</span></div>)}
            </div>
        </>
    );

    const renderABTestLabel = () => (
        <>
            {buildTicketLink(number, brand)}
            <a className="experiment-link" href={`https://egtnl.prod.expedia.com/experiment/${annotation?.ab_test_details?.experiment_id}`} target="_blank">{annotation?.ab_test_details?.experiment_name}</a>
            <span className="experiment-status">{`status: ${annotation?.ab_test_details?.status}`}</span>
            <span className="experiment-owner">{annotation?.ab_test_details?.owner}</span>
        </>
    );

    const renderRevLossLabel = () => (
        <>
            <span>{priority}</span>
            <span className="summary">{summary}</span>
            <span>{status}</span>
            {isImpulse ?
                <div>
                    {buildTicketLink(id, null, url)}
                    <div>
                        <span>{'Revenue Loss:'}</span>
                        <span>{typeof revLoss === 'string' ? 'NA' : ` $${revLoss.toLocaleString()}`}</span>
                    </div>
                    <button className="details-btn" onClick={() => setTableData([annotation])}>{'More Details'}</button>
                </div>
                : buildTicketLink(id, brand)
            }
        </>
    );

    const renderLabel = () => {
        switch (category) {
            case DEPLOYMENT_ANNOTATION_CATEGORY:
                return renderDeploymentLabel();
            case AB_TESTS_ANNOTATION_CATEGORY:
                return renderABTestLabel();
            default:
                return renderRevLossLabel();
        }
    };

    return (
        <foreignObject
            className="foreign-object"
            x={x - 5.5}
            y={isImpulse ? -5 : -12}
            width={10}
            height={10}
        >
            <div className={`annotation-tooltip ${isImpulse ? 'incidents-impulse' : category}`}>
                <div className="tooltip-body">
                    <p className="timestamp">{`${moment(time).format('YYYY-MM-DD HH:mm')} ${moment().tz(moment.tz.guess()).format('z')}`}</p>
                    <div className="tooltip-wrapper">
                        {renderLabel()}
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
