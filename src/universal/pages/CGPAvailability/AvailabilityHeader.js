import React from 'react';
import {SVGIcon} from '@homeaway/react-svg';
import {SEARCH__16} from '@homeaway/svg-defs';
import moment from 'moment';
import {DATE_FORMAT} from './constants';

const AvailabilityHeader = ({content, handleHeaderClick, dateTimeFormat}) =>
    (
        <div className="availability-header-cell" key={`${content}-header`}>
            {content}
            {
                moment(content, dateTimeFormat).isValid() && dateTimeFormat === DATE_FORMAT &&
                    <div className="pointer search-icon" role="button" onClick={() => handleHeaderClick(content)} tabIndex={0} onKeyDown={handleHeaderClick}>
                        <SVGIcon inline markup={SEARCH__16} />
                    </div>
            }

        </div>
    );

export default AvailabilityHeader;
