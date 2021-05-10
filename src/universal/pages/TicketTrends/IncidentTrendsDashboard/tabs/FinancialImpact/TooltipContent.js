import React from 'react';

const htmlDecode = (input) => {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent;
};

const TooltipContent = ({link, lostRevenue}) => (
    <div key={link} className="incident-wrapper">
        <div
            className="incident-number"
            dangerouslySetInnerHTML={{ //eslint-disable-line
                __html: htmlDecode(link)
            }}
        />
        <div className="incident-financial-impact">
            {lostRevenue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
        </div>
    </div>
);

export default TooltipContent;
