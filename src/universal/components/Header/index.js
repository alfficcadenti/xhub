import React, {useState, useRef} from 'react';
import {Link, withRouter, useHistory} from 'react-router-dom';
import {Dropdown} from '@homeaway/react-dropdown';
import {Navigation, HScroll} from '@homeaway/react-navigation';
import BrandSelector from './BrandSelector';
import Help from './Help';
import Search from './Search';
import {getBrand, getVisiblePages} from '../../pages/utils';
import ALL_PAGES from '../../pages/index';
import './styles.less';
import {SVGIcon} from '@homeaway/react-svg';
import {NEW_WINDOW__16} from '@homeaway/svg-defs';

const DEFAULT_PAGE_INFO = {
    title: 'OpxHub',
    team: 'opex',
    owner: 'Ranjith Peddi',
    slack: 'opxhub-support',
    email: 'opex-opxhub-team@expediacorp.onmicrosoft.com',
    description: ''
};

const Header = ({selectedBrands = [], onBrandChange, brands = []}) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedPages, setSelectedPages] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchInput = useRef(null);
    const history = useHistory();

    const BRAND_QUERY = `?selectedBrand=${selectedBrands[0]}`;
    const VISIBLE_PAGES = getVisiblePages(selectedBrands);
    const CATEGORIES = VISIBLE_PAGES.reduce((acc, {category}) => (acc.includes(category) ? acc : [...acc, category]), []);

    const handleOnBlur = () => {
        setIsSearchOpen(false);
        searchInput.current.blur();
        setSelectedPages(['']);
    };

    const handleOnSearch = ({value}) => {
        if (value) {
            handleOnBlur();
            history.push(`${value}${BRAND_QUERY}`);
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

    const handleDropdownOpen = () => setIsDropdownOpen(true);

    const handleDropdownHide = () => setIsDropdownOpen(false);

    const renderCategoryDropdown = (category) => (
        <Dropdown
            key={category}
            id={`${category}-dropdown`}
            label={category}
            className="category-dropdown"
            onDropdownShow={handleDropdownOpen}
            onDropdownHide={handleDropdownHide}
            closeAfterContentClick
            noArrow
        >
            {VISIBLE_PAGES
                .filter((p) => p.category === category)
                .sort((a, b) => a.text.localeCompare(b.text))
                .map((p) => {
                    if (p.external) {
                        return <li key={p.text}><Link to={{pathname: `${p.link}`}} target="_blank" className="category-dropdown-item">{p.text} <SVGIcon usefill markup={NEW_WINDOW__16} /></Link></li>;
                    }
                    return <li key={p.text}><Link to={`${p.link}${BRAND_QUERY}`} className="category-dropdown-item">{p.text}</Link></li>;
                })}
        </Dropdown>
    );

    const LINKS = CATEGORIES.map((category) => ({
        label: category,
        href: `#${category.replace(/\s+/g, '-').toLowerCase()}`,
        node: renderCategoryDropdown(category)
    }));

    return (
        <div className="header">
            <div className={`header__navigation ${isDropdownOpen ? 'active' : ''}`}>
                <Link to={`/impulse${BRAND_QUERY}`} className="header--logo">
                    {'OpXHub'}
                </Link>
                <HScroll scrollIncrement={0.5}>
                    <Navigation noMobileSelect activeIndex={-1} links={LINKS} />
                </HScroll>
            </div>
            <div className="header__controls">
                <Search
                    ref={searchInput}
                    isSearchOpen={isSearchOpen}
                    onSearch={handleOnSearch}
                    onBlur={handleOnBlur}
                    onToggleSearch={handleToggleSearch}
                    selectedPages={selectedPages}
                    options={ALL_PAGES.map(({text, link}) => ({label: text, value: link}))}
                />
                <Help info={DEFAULT_PAGE_INFO} />
                <BrandSelector
                    selectedBrands={selectedBrands.map((brand) => getBrand(brand, 'label').retailLabel)}
                    onBrandChange={onBrandChange}
                    brands={brands.map((brand) => getBrand(brand, 'label').retailLabel)}
                />
            </div>
        </div>
    );
};

export default withRouter(Header);
