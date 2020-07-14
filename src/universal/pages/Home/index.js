import React from 'react';
import {Link} from 'react-router-dom';
import dashboardsList from '../index';
import './styles.less';
import {useSelectedBrand} from '../hooks';

const Home = ({selectedBrands}) => {
    useSelectedBrand(selectedBrands[0]);

    const renderButton = (item) => (
        <Link
            to={{pathname: item.link}}
            key={`link-${item.id}`}
            className="dashboard-button"
        >
            <span
                id={item.id}
                key={item.id}
            >
                {item.text}
            </span>
        </Link>
    );

    return (
        <div className="home-container">
            <div className="home-buttons-container">
                {dashboardsList.map(renderButton)}
            </div>
        </div>
    );
};

export default Home;