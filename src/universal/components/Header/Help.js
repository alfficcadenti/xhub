import React from 'react';
import sanitizeHtml from 'sanitize-html';
import {Dropdown} from '@homeaway/react-dropdown';
import {QUESTION__24} from '@homeaway/svg-defs';
import {SVGIcon} from '@homeaway/react-svg';
import './Help.less';

const renderHelpRow = (label, value, type) => {
    if (!value) {
        return null;
    }
    let valueComponent;
    if (!type) {
        valueComponent = value;
    } else if (type === 'slack') {
        valueComponent = <a href={`https://expedia.slack.com/messages/${value}`} target="_blank" rel="noopener noreferrer">{'#'}{value}</a>;
    } else if (type === 'email') {
        valueComponent = <a href={`mailto:${value}`}>{value}</a>;
    }
    return (
        <div className="help-item">
            <div className="help-label">{label}</div>
            <div className="help-value">{valueComponent}</div>
        </div>
    );
};

const Help = ({info}) => {
    const {
        title, team, owner, slack, email, description
    } = info;

    return (
        <Dropdown
            id="header-help"
            label="Help"
            className="header-help"
            buttonChildren={<SVGIcon className="Header--icon" markup={QUESTION__24} />}
            dropdownRight
            srOnlyLabel
            noArrow
        >
            <div className="help-container">
                <h3>{title}</h3>
                <div className="help-info">
                    {renderHelpRow('Team', team)}
                    {renderHelpRow('Owner', owner)}
                    {renderHelpRow('Slack', slack, 'slack')}
                    {renderHelpRow('E-mail', email, 'email')}
                </div>
                <div className="help-description">
                    <div
                        dangerouslySetInnerHTML={{__html: sanitizeHtml(description || '')}} // eslint-disable-line
                    />
                </div>
            </div>
        </Dropdown>
    );
};

export default Help;
