import React, {forwardRef} from 'react';
import Select from 'react-select';
import {SEARCH__24} from '@homeaway/svg-defs';
import {SVGIcon} from '@homeaway/react-svg';
import './styles.less';

const Search = ({isSearchOpen, onSearch, onBlur, onToggleSearch, selectedPages, options}, ref) => {
    return (
        <div role="searchbox" className={`site-search-container ${isSearchOpen ? 'active' : ''}`} >
            <div role="button" className="btn btn-default search-toggle-btn" onClick={onToggleSearch} tabIndex={0} onKeyDown={onToggleSearch}>
                <SVGIcon markup={SEARCH__24} />
            </div>
            <div data-testid="searchtext" className={'site-search-form'} style={{visibility: isSearchOpen ? '' : 'hidden'}} >
                <Select
                    ref={ref}
                    className="site-search-input"
                    placeholder=""
                    value={selectedPages}
                    options={options}
                    onChange={onSearch}
                    noOptionsMessage={() => 'No Results Found'}
                />
                <div className={`site-search-blur ${isSearchOpen ? 'active' : ''}`} onClick={onBlur} onKeyUp={onBlur} role="presentation" />
            </div>

        </div>
    );
};
export default forwardRef(Search);