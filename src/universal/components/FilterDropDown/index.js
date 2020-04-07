import React, {PureComponent} from 'react';
import {Dropdown, DropdownItem} from '@homeaway/react-dropdown';
import PropTypes from 'prop-types';

class FilterDropDown extends PureComponent {
    render() {
        const {id, list, selectedValue, onClickHandler, className} = this.props;
        return (
            <Dropdown id={id} label={selectedValue} className={className}>
                {
                    list.map((item) => (
                        <DropdownItem key={item} text={item} link="#" onClick={() => onClickHandler(item)} />
                    ))
                }
            </Dropdown>
        );
    }
}

FilterDropDown.defaultProps = {
    className: ''
};

FilterDropDown.propTypes = {
    id: PropTypes.string,
    selectedValue: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClickHandler: PropTypes.func.isRequired,
    className: PropTypes.string
};
export default FilterDropDown;