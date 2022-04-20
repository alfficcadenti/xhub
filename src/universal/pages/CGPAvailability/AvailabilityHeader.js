import React from 'react';
import {SVGIcon} from '@homeaway/react-svg';
import {SEARCH__16} from '@homeaway/svg-defs';

const AvailabilityHeader = ({content, handleHeaderClick, enableHeaderClick}) =>
    (
        <div className="availability-header-cell" key={`${content}-header`}>
            {content}
            {
                enableHeaderClick &&
                    <div className="pointer search-icon" role="button" onClick={() => handleHeaderClick(content)} tabIndex={0} onKeyDown={() => handleHeaderClick(content)}>
                        <SVGIcon inline markup={SEARCH__16} />
                    </div>
            }

        </div>
    );

export default AvailabilityHeader;
