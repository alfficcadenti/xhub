import React from 'react';
import {Link} from 'react-router-dom';
import {getVisiblePages} from '../utils';
import './styles.less';
import {useSelectedBrand, useQueryParamChange} from '../hooks';

const Home = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    const SELECTED_BRAND = selectedBrands[0];
    useQueryParamChange(SELECTED_BRAND, onBrandChange);
    useSelectedBrand(SELECTED_BRAND, onBrandChange, prevSelectedBrand);

    const renderButton = (item) => (
        <Link to={`${item.link}?selectedBrand=${selectedBrands[0]}`} key={`link-${item.id}`} className="dashboard-button">
            <span id={item.id} key={item.id}>
                {item.text}
            </span>
        </Link>
    );

    return (
        <div className="home-container">
            <div className="home-buttons-container">
                {getVisiblePages(selectedBrands, 'hidden').map(renderButton)}
            </div>
        </div>
    );
};

export default Home;
