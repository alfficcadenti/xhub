import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '../LoadingContainer';
import SearchableList from '@homeaway/react-searchable-list';

class InputListComponent extends PureComponent {
    onChange = (selected) => {
        this.props.onChange(selected);
    }

    render() {
        const {
            isLoading,
            error,
            options,
            inputProps,
            id
        } = this.props;

        return (
            <LoadingContainer isLoading={isLoading} error={error} id={id}>
                <SearchableList
                    labelKey="name"
                    options={options}
                    inputProps={inputProps}
                    onChange={this.onChange}
                />
            </LoadingContainer>
        );
    }
}

InputListComponent.defaultProps = {
    error: '',
    isLoading: null,
    options: [],
    inputProps: {
        label: 'Field Name',
        id: 'list-input'
    },
    id: null
};

InputListComponent.propTypes = {
    error: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.shape()
    ]),
    isLoading: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape()
    ])),
    inputProps: PropTypes.shape(),
    onChange: PropTypes.func
};

export default InputListComponent;