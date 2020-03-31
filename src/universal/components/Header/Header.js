import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Dropdown} from '@homeaway/react-dropdown';
import SiteMenu from './SiteMenu';
import './Header.less';

const Header = () => (
    <header className="Header">
        <Link to="/home" className="Header--logo" >
            {'OpXHub'}
        </Link>
        <Dropdown id="Header--menu" label="Dashboards" className="Header--menu">
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