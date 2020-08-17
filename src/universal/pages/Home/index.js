import React from 'react';
import {Link} from 'react-router-dom';
import {getVisiblePages} from '../utils';
import './styles.less';
import {useSelectedBrand, useQueryParamChange} from '../hooks';

const Home = ({selectedBrands, onBrandChange, prevSelectedBrand}) => {
    useQueryParamChange(selectedBrands[0], onBrandChange);
    useSelectedBrand(selectedBrands[0], onBrandChange, prevSelectedBrand);

    const renderButton = (item) => (
        <Link to={{pathname: item.link}} key={`link-${item.id}`} className="dashboard-button">
            <span id={item.id} key={item.id}>
                {item.text}
            </span>
        </Link>
    );

    return (
        <div className="home-container">
            <div className="home-buttons-container">
                {getVisiblePages(selectedBrands).map(renderButton)}
            </div>
        </div>
    );
};

export default Home;