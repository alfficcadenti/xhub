import React, {PureComponent} from 'react';
import {Dropdown, DropdownItem} from '@homeaway/react-dropdown';
import PropTypes from 'prop-types';

class FilterDropDown extends PureComponent {
    render() {
        const {id, list, selectedValue, onClickHandler} = this.props;
        return (
            <Dropdown id={id} label={selectedValue}>
                {
                    list.map((item) => (
                        <DropdownItem key={item} text={item} link="#" onClick={() => onClickHandler(item)} />
                    ))
                }
            </Dropdown>
        );
    }
}

FilterDropDown.propTypes = {
    id: PropTypes.string,
    selectedValue: PropTypes.string,
    list: PropTypes.array.isRequired,
    onClickHandler: PropTypes.func.isRequired,
};
export default FilterDropDown;