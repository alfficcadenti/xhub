import React, {useState, useRef} from 'react';
import {useLocation} from 'react-router';
import {Link, withRouter} from 'react-router-dom';
import {Redirect} from 'react-router';
import sanitizeHtml from 'sanitize-html';
import Select from 'react-select';
import {SVGIcon} from '@homeaway/react-svg';
import {QUESTION__24, SEARCH__24} from '@homeaway/svg-defs';
import {Dropdown} from '@homeaway/react-dropdown';
import BrandSelector from './BrandSelector';
import PAGES from '../../pages';
import './styles.less';

const CATEGORIES = PAGES.reduce((acc, {category}) => (acc.includes(category) ? acc : [...acc, category]), []);
const DEFAULT_PAGE_INFO = {
    title: 'OpxHub',
    team: 'opex',
    owner: 'Ranjith Peddi',
    slack: 'opex-reo-opxhub',
    email: 'opex-opxhub-team@expediacorp.onmicrosoft.com',
    description: ''
};

const Header = (props) => {
    const [redirectLink, setRedirectLink] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedPages, setSelectedPages] = useState([]);
    const searchInput = useRef(null);
    const {pathname} = useLocation();

    const handleOnBlur = () => {
        setIsSearchOpen(false);
        searchInput.current.blur();
        setSelectedPages(['']);
    };

    const handleOnSearch = ({value}) => {
        if (value) {
            handleOnBlur();
            setRedirectLink(value);
        }
    };

    const handleToggleSearch = () => {
        const nextSearchIsOpen = !isSearchOpen;
        if (nextSearchIsOpen) {
            searchInput.current.focus();
        } else {
            setSelectedPages(['']);
        }
        setIsSearchOpen(nextSearchIsOpen);
    };

    const renderCategoryDropdown = (category) => (
        <Dropdown
            key={category}
            id={`${category}-dropdown`}
            label={category}
            className="category-dropdown"
            closeAfterContentClick
        >
            {PAGES
                .filter((p) => p.category === category)
                .map((p) => (<li key={p.text}><Link to={p.link} className="category-dropdown-item">{p.text}</Link></li>))
            }
        </Dropdown>
    );

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

    const renderHelp = ({title, team, owner, slack, email, description}) => (
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

    const renderSearch = () => (
        <div className={`site-search-container ${isSearchOpen ? 'active' : ''}`}>
            <Select
                ref={searchInput}
                className="site-search-input"
                placeholder=""
                value={selectedPages}
                options={PAGES.map(({text, link}) => ({label: text, value: link}))}
                onChange={handleOnSearch}
                noOptionsMessage={() => 'No Results Found'}
            />
            <div className={`site-search-blur ${isSearchOpen ? 'active' : ''}`} onClick={handleOnBlur} />  {/* eslint-disable-line */}
        </div>
    );

    return (
        <div className="header">
            {redirectLink && <Redirect push to={redirectLink} />}
            <Link to="/home" className="header--logo" >
                {'OpXHub'}
            </Link>
            {CATEGORIES.map(renderCategoryDropdown)}
            {pathname.includes('landing-page') && (
                <BrandSelector
                    selectedAppBrand={props.selectedAppBrand}
                    setSelectedAppBrand={props.setSelectedAppBrand}
                    brands={props.brands}
                />
            )}
            {renderHelp(DEFAULT_PAGE_INFO)}
            <div role="button" className="btn btn-default search-toggle-btn" onClick={handleToggleSearch} tabIndex={0} onKeyDown={handleToggleSearch}>
                <SVGIcon markup={SEARCH__24} />
            </div>
            {renderSearch()}
        </div>
    );
};

export default withRouter(Header);