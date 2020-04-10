import React, {useState} from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Dropdown} from '@homeaway/react-dropdown';
import SiteMenu from './SiteMenu';
import FeedbackModal from '../Feedback';
import {ButtonOverlay} from '@homeaway/react-buttons';
import './Header.less';

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <header className="header">
            <Link to="/home" className="header--logo" >
                {'OpXHub'}
            </Link>
            <Dropdown id="header-dropdown" label="Dashboards" className="header--menu">
                <SiteMenu />
            </Dropdown>
            <ButtonOverlay
                label="Feedback"
                size="xs"
                onClick={() => setIsModalOpen(true)}
                className="feedback-button"
            />
            <FeedbackModal isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)}/>
        </header>
    );
};

Header.propTypes = {
    location: PropTypes.shape()
};

Header.defaultProps = {
    location: {}
};

export default withRouter(Header);