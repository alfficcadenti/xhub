import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {getVisiblePages} from '../utils';
import './styles.less';
import {useSelectedBrand, useQueryParamChange} from '../hooks';
import {SVGIcon} from '@homeaway/react-svg';
import {NEW_WINDOW__16} from '@homeaway/svg-defs';

const Home = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const SELECTED_BRAND = selectedBrands[0];
    useQueryParamChange(SELECTED_BRAND, onBrandChange);
    useSelectedBrand(SELECTED_BRAND, onBrandChange, prevSelectedBrand);

    const renderButton = (item) => {
        if (item.external) {
            return (<Link to={{pathname: `${item.link}`}} key={item.id} target="_blank" className="dashboard-button">
                <span id={item.id} key={item.id}>
                    {item.text} <SVGIcon usefill markup={NEW_WINDOW__16} />
                </span></Link>);
        }
        return (<Link to={`${item.link}?selectedBrand=${selectedBrands[0]}`} key={`link-${item.id}`} className="dashboard-button">
            <span id={item.id} key={item.id}>
                {item.text}
            </span>
        </Link>);
    };

    return (
        <div className="home-container">
            <div className="home-buttons-container">
                {getVisiblePages(selectedBrands).map(renderButton)}
            </div>
        </div>
    );
};

export default withRouter(Home);
