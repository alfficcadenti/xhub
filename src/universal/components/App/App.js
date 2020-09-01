import React, {Fragment, useCallback, useState} from 'react';
import {withRouter} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../Header';
import Feedback from '../Feedback';
import PAGES from '../../pages';
import {EG_BRAND, BRANDS} from '../../constants';
import {usePrevious} from '../../pages/hooks';
import {getBrand} from '../../pages/utils';


function renderRoute(p, selectedBrands, handleBrandChange, prevSelectedBrand) {
    const Page = withRouter(p.component.default);
    return <Route key={p.link} path={p.link} render={() => <Page selectedBrands={selectedBrands} onBrandChange={handleBrandChange} prevSelectedBrand={prevSelectedBrand} />} />;
}

function App() {
    const validBrands = BRANDS.map((brand) => brand.label);
    let storedBrands;
    try {
        // Validate selected brands
        const query = new URLSearchParams(window.location.search);
        const selectedBrand = query.get('selectedBrand');

        if (selectedBrand) {
            storedBrands = [selectedBrand];
        } else {
            storedBrands = String(localStorage.getItem('selectedBrands') || '')
                .split(',')
                .filter((brand) => validBrands.includes(brand));
            // Default to EG_BRAND if none selected
            if (!storedBrands.length) {
                localStorage.setItem('selectedBrands', [EG_BRAND]);
                storedBrands = [EG_BRAND];
            }
        }
    } catch {
        storedBrands = [EG_BRAND];
    }

    const [selectedBrands, setSelectedBrands] = useState(storedBrands);

    const handleBrandChange = useCallback((brands) => {
        const convertedLabels = brands.map((brand) => getBrand(brand, 'retailLabel').label);

        localStorage.setItem('selectedBrands', convertedLabels);
        setSelectedBrands(convertedLabels);

        localStorage.setItem('isBrandFilterChanged', JSON.stringify(true));
        localStorage.setItem('isQueryChanged', JSON.stringify(false));
    }, []);

    const prevSelectedBrand = usePrevious(selectedBrands[0]);
    return (
        <Fragment>
            <Header selectedBrands={selectedBrands} onBrandChange={handleBrandChange} brands={validBrands} />
            <Feedback />
            <div className="main-container">
                <Switch>
                    {PAGES.map((p) => renderRoute(p, selectedBrands, handleBrandChange, prevSelectedBrand))}
                </Switch>
            </div>
        </Fragment>
    );
}

App.propTypes = {
    location: PropTypes.string
};

export default App;
