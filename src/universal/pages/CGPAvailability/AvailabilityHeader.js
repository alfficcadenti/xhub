import React from 'react';
import {SVGIcon} from '@homeaway/react-svg';
import {SEARCH__16} from '@homeaway/svg-defs';

const AvailabilityHeader = ({content, value, onHeaderClick, enableHeaderClick}) =>
    (
        <div className="availability-header-cell" key={`${content}-header`}>
            {content}
            {
                enableHeaderClick &&
                    <div className="pointer search-icon" role="button" onClick={() => onHeaderClick(value)} tabIndex={0} onKeyDown={() => onHeaderClick(value)}>
                        <SVGIcon inline markup={SEARCH__16} />
                    </div>
            }

        </div>
    );

export default AvailabilityHeader;
