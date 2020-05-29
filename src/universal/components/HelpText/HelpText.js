import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@homeaway/react-tooltip';
import {SVGIcon} from '@homeaway/react-svg';
import {INFO__16} from '@homeaway/svg-defs';
import './HelpText.less';

const HelpText = ({text = '', className = '', placement = ''}) => (
    <span className="helptext">
        <Tooltip content={text} wrapperClassName={className} placement={placement}>
            <SVGIcon markup={INFO__16} />
        </Tooltip>
    </span>);

HelpText.propTypes = {
    text: PropTypes.string,
    className: PropTypes.string,
    placement: PropTypes.string
};

export default HelpText;