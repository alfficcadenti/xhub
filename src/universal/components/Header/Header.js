import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Dropdown} from '@homeaway/react-dropdown';
import {GLOBE__24} from '@homeaway/svg-defs/lib';
import {SVGIcon} from '@homeaway/react-svg/lib/transpiled';
import SiteMenu from './SiteMenu';
import './Header.less';

const Header = () => (
    <header className="Header">
        <Link to="/incident-trends" className="Header--logo">
            <SVGIcon className="Header--icon" markup={GLOBE__24} />
        </Link>
        <Dropdown id="Header--menu" label="OpXHub" className="Header--menu">
            <SiteMenu />
        </Dropdown>
    </header>
);

Header.propTypes = {
    location: PropTypes.shape()
};

Header.defaultProps = {
    location: {}
};

export default withRouter(Header);