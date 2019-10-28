import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '../LoadingContainer';
import SearchableList from '@homeaway/react-searchable-list';

class InputListComponent extends PureComponent {
    onChange = (selected) => {
        this.props.onChange(selected)
    }

    render() {
        const {
            isLoading,
            error,
            options,
            inputProps,
        } = this.props;

        return (
            <LoadingContainer isLoading={isLoading} error={error}>
                <SearchableList 
                    labelKey="name"
                    options={options}
                    inputProps={inputProps}
                    onChange={this.onChange}
            />
            </LoadingContainer>
    )
    }
}

InputListComponent.defaultProps = {
    error: '',
    isLoading: null,
    options: [],
    inputProps: {
        label: 'Field Name',
        id: 'list-input'
    }
};

InputListComponent.propTypes = {
    error: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.shape()
    ]),
    isLoading: PropTypes.bool,
    options: PropTypes.array,
    inputProps: PropTypes.object,
    onChange: PropTypes.func
};

export default InputListComponent;