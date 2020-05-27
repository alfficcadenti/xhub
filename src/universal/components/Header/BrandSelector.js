import React, {useState} from 'react';
import {Dropdown} from '@homeaway/react-dropdown';
import './BrandSelector.less';

const BrandSelector = ({selectedAppBrand, setSelectedAppBrand, brands}) => {
    const [selectedBrand, setSelectedBrand] = useState(selectedAppBrand || brands[0]);

    const generateOnClick = (brand) => () => {
        setSelectedBrand(brand);
        setSelectedAppBrand(brand);
        localStorage.setItem('selectedBrand', brand);
    };

    const renderBrandItem = (brand) => (
        <li key={brand}>
            <a onClick={generateOnClick(brand)} onKeyDown={generateOnClick(brand)}>
                {brand}
            </a>
        </li>
    );

    return (
        <Dropdown
            id="brand-selector"
            label={selectedBrand}
            className="header--brand-selector"
            closeAfterContentClick
            dropdownRight
            noArrow
        >
            {brands.map(renderBrandItem)}
        </Dropdown>
    );
};

export default BrandSelector;