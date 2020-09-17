import React, {useState, useRef} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Redirect} from 'react-router';
import {Dropdown} from '@homeaway/react-dropdown';
import BrandSelector from './BrandSelector';
import Help from './Help';
import Search from './Search';
import {getBrand, getVisiblePages} from '../../pages/utils';
import './styles.less';

const DEFAULT_PAGE_INFO = {
    title: 'OpxHub',
    team: 'opex',
    owner: 'Ranjith Peddi',
    slack: 'opex-reo-opxhub',
    email: 'opex-opxhub-team@expediacorp.onmicrosoft.com',
    description: ''
};

const Header = ({selectedBrands, onBrandChange, brands}) => {
    const [redirectLink, setRedirectLink] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedPages, setSelectedPages] = useState([]);
    const searchInput = useRef(null);

    const BRAND_QUERY = `?selectedBrand=${selectedBrands[0]}`;
    const VISIBLE_PAGES = getVisiblePages(selectedBrands, 'hidden');
    const CATEGORIES = VISIBLE_PAGES.reduce((acc, {category}) => (acc.includes(category) ? acc : [...acc, category]), []);

    const handleOnBlur = () => {
        setIsSearchOpen(false);
        searchInput.current.blur();
        setSelectedPages(['']);
    };

    const handleOnSearch = ({value}) => {
        if (value) {
            handleOnBlur();
            setRedirectLink(`${value}${BRAND_QUERY}`);
        }
    };

    const handleToggleSearch = () => {
        const nextSearchIsOpen = !isSearchOpen;
        if (nextSearchIsOpen) {
            searchInput.current.focus();
        } else {
            setSelectedPages(['']);
        }
        setIsSearchOpen(nextSearchIsOpen);
    };

    const renderCategoryDropdown = (category) => (
        <Dropdown
            key={category}
            id={`${category}-dropdown`}
            label={category}
            className="category-dropdown"
            closeAfterContentClick
        >
            {VISIBLE_PAGES
                .filter((p) => p.category === category)
                .map((p) => (<li key={p.text}><Link to={`${p.link}${BRAND_QUERY}`} className="category-dropdown-item">{p.text}</Link></li>))
            }
        </Dropdown>
    );

    return (
        <div className="header">
            {redirectLink && <Redirect push to={redirectLink} />}
            <Link to={`/impulse${BRAND_QUERY}`} className="header--logo" >
                {'OpXHub'}
            </Link>
            {CATEGORIES.map(renderCategoryDropdown)}
            <BrandSelector
                selectedBrands={selectedBrands.map((brand) => getBrand(brand, 'label').retailLabel)}
                onBrandChange={onBrandChange}
                brands={brands.map((brand) => getBrand(brand, 'label').retailLabel)}
            />
            <Help info={DEFAULT_PAGE_INFO} />
            <Search
                ref={searchInput}
                isSearchOpen={isSearchOpen}
                onSearch={handleOnSearch}
                onBlur={handleOnBlur}
                onToggleSearch={handleToggleSearch}
                selectedPages={selectedPages}
                options={getVisiblePages(selectedBrands, 'hiddenFromSearch').map(({text, link}) => ({label: text, value: link}))}
            />
        </div>
    );
};

export default withRouter(Header);
