import React from 'react';
import {Dropdown} from '@homeaway/react-dropdown';
import {EG_BRAND} from '../../../constants';
import {getBrand} from '../../../pages/utils';
import './styles.less';


const BrandSelector = ({selectedBrands, onBrandChange, brands}) => {
    const handleOnClick = (e, brand) => {
        let nextSelectedBrands;
        e.preventDefault();
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

        onBrandChange(nextSelectedBrands.map((nextBrand) => getBrand(nextBrand, 'retailLabel')?.label));
    };

    const renderBrandItem = (brand) => (
        <li key={brand}>
            <button
                onClick={(e) => handleOnClick(e, brand)}
                onKeyDown={() => handleOnClick(brand)}
                tabIndex={0}
                className={selectedBrands.includes(brand) ? 'selected' : ''}
            >
                {brand}
            </button>
        </li>
    );
    return (
        <Dropdown
            id="brand-selector"
            label={selectedBrands.join(', ')}
            className="header--brand-selector"
            dropdownRight
            noArrow
            closeAfterContentClick
        >
            {brands.map(renderBrandItem)}
        </Dropdown>
    );
};

export default BrandSelector;
