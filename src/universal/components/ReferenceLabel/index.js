import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {v1 as uuid} from 'uuid';
import sanitizeHtml from 'sanitize-html';

const ReferenceLabel = ({viewBox, annotation}) => {
    const text = annotation.title
        ? <><span dangerouslySetInnerHTML={{__html: sanitizeHtml(annotation.title)}} />: {annotation.text}</> // eslint-disable-line
        : <span dangerouslySetInnerHTML={{__html: sanitizeHtml(annotation.text)}} />; // eslint-disable-line

    return (
        <foreignObject
            x={viewBox.x}
            y={viewBox.y + (annotation.index % 2) * 92}
            className="foreign-object"
        >
            <div className="custom-tooltip">
                <p className="timestamp">{moment(annotation.time).format('YYYY-MM-DD hh:mm')}</p>
                <p>{text}</p>
                <div className="tags">
                    {annotation.tags && annotation.tags.map((t) => <div key={uuid()} className="tag"><span>{t}</span></div>)}
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
