import React from 'react';
import {Dropdown} from '@homeaway/react-dropdown';
import './BrandSelector.less';
import {EG_BRAND} from '../../constants';


const BrandSelector = ({selectedBrands, onBrandChange, brands}) => {
    const handleOnClick = (brand) => {
        let nextSelectedBrands;
        if (brand === EG_BRAND) {
            nextSelectedBrands = [brand];
        } else {
            nextSelectedBrands = [...selectedBrands];
            // Remove Expedia Group
            const egIdx = selectedBrands.indexOf(EG_BRAND);
            if (egIdx > -1) {
                nextSelectedBrands.splice(egIdx, 1);
            }
            // Toggle Brand
            const idx = selectedBrands.indexOf(brand);
            if (idx > -1) {
                nextSelectedBrands.splice(idx, 1);
                // If no brand selected, default to Expedia Group
                if (nextSelectedBrands.length < 1) {
                    nextSelectedBrands = [EG_BRAND];
                }
            } else {
                nextSelectedBrands = [brand];
            }
        }

        onBrandChange(nextSelectedBrands);
    };

    const renderBrandItem = (brand) => (
        <li key={brand}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
                onClick={() => handleOnClick(brand)}
                onKeyDown={() => handleOnClick(brand)}
                role="button"
                tabIndex={0}
                className={selectedBrands.includes(brand) ? 'selected' : ''}
            >
                {brand}
            </a>
        </li>
    );
    return (
        <Dropdown
            id="brand-selector"
            label={selectedBrands.join(', ')}
            className="header--brand-selector"
            dropdownRight
            noArrow
        >
            {brands.map(renderBrandItem)}
        </Dropdown>
    );
};

export default BrandSelector;