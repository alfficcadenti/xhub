import React from 'react';
import {useLocation} from 'react-router-dom';
import sanitizeHtml from 'sanitize-html';
import {Dropdown} from '@homeaway/react-dropdown';
import {QUESTION__24} from '@homeaway/svg-defs';
import {SVGIcon} from '@homeaway/react-svg';
import {getPageInfo} from './info';
import './styles.less';

const Help = () => {
    const {pathname} = useLocation();
    const {
        title, team, owner, slack = {}, email, description
    } = getPageInfo(pathname);
    const renderHelpRow = (label, value) => (
        <div className="help-item">
            <div className="help-label">{label}</div>
            <div className="help-value">{value || '-'}</div>
        </div>
    );

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
                    {renderHelpRow('Slack', <a href={`https://expedia.slack.com/archives/${slack.id}`} target="_blank" rel="noopener noreferrer">{'#'}{slack.name}</a>)}
                    {renderHelpRow('E-mail', <a href={`mailto:${email}`}>{email}</a>)}
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
