import React from 'react';
import './ExpandableRow.less';


const ExpandableRow = ({executiveSummary, rootCauseOwners}) => (
    <div className="expandable-row-wrapper">
        <div className="expandable-row">
            <span className="expandable-row-header">{'Incident Executive Summary:'}</span>
            <div className="expandable-row-section">
                {executiveSummary}
            </div>
        </div>
        <div className="expandable-row">
            <span className="expandable-row-header">{'Resolution Notes:'}</span>
            <div className="expandable-row-section">
                {rootCauseOwners}
            </div>
        </div>
    </div>
);

export default ExpandableRow;
