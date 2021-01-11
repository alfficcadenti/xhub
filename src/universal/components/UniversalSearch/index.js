import React, {useState, useEffect} from 'react';
import './styles.less';
import {SearchableList} from '@homeaway/react-searchable-list';
import {Token} from '@homeaway/react-input-tokenize';
import {adjustInputValue} from '../../pages/utils';

const UniversalSearch = ({onFilterChange, suggestionMapping, suggestions, defaultSelection, resetSelection}) => {
    const [keyTags, setKeyTags] = useState([]);
    const [selected, setSelected] = useState([]);
    const [typeaheadList, setTypeaheadList] = useState(keyTags);
    const [isKeySelection, setIsKeySelection] = useState(true);
    const [fieldSelection, setFieldSelection] = useState(defaultSelection || []);
    const [clear, setClear] = useState(false);
    const [label, setLabel] = useState('Select the field to search');
    const [valueToggle, setValueToggle] = useState(false);

    useEffect(() => {
        if (resetSelection) {
            setFieldSelection([]);
        }
    }, [resetSelection]);

    const onClear = () => {
        setSelected([]);
        setClear(true);
        document.activeElement.blur();
    };

    const checkIfValueExists = (value, inputValue) => {
        const adjustedInputValue = adjustInputValue(inputValue);
        const lastSelectionItem = inputValue[inputValue.length - 1];
        const foundSelection = adjustedInputValue.find((item) => item.key === lastSelectionItem.key);

        return foundSelection && foundSelection.values.includes(value);
    };

    const onChange = ([selection]) => {
        try {
            const newFieldSelection = [...fieldSelection];
            if (isKeySelection) {
                newFieldSelection.push({key: selection.key, value: ''});
            } else if (checkIfValueExists(selection, newFieldSelection)) {
                setValueToggle(!valueToggle);
                newFieldSelection.pop();
            } else {
                setValueToggle(!valueToggle);
                newFieldSelection[newFieldSelection.length - 1].value = selection;
            }

            setFieldSelection(newFieldSelection);
            setIsKeySelection(!isKeySelection);
            onClear();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
    };

    const selectedProduct = () => {
        const products = fieldSelection && fieldSelection.length && fieldSelection.filter((x) => x.key === 'productName');
        return products;
    };

    const productApplications = (products) => {
        const adjustedApplications = products.reduce((acc, current) => {
            const currentApplicationNames = suggestionMapping.find((item) => item.productName === current.value).applicationNames;
            return [...acc, ...currentApplicationNames];
        }, []);
        return adjustedApplications && adjustedApplications.length ? adjustedApplications : '';
    };

    // eslint-disable-next-line complexity
    const setNewTypeaheadList = () => {
        try {
            if (isKeySelection) {
                setTypeaheadList(keyTags);
            } else {
                const products = selectedProduct();
                const currentFilter = fieldSelection && fieldSelection.length && fieldSelection[fieldSelection.length - 1];
                if (products && products.length && currentFilter.key === 'applicationName') {
                    const newList = productApplications(products) ?
                        productApplications(products) :
                        suggestions[fieldSelection[fieldSelection.length - 1].key];
                    setTypeaheadList(newList);
                } else {
                    const newList = suggestions[fieldSelection[fieldSelection.length - 1].key];
                    setTypeaheadList(newList);
                }
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
    };

    const setNewLabel = () => {
        try {
            const newLabel = isKeySelection ? 'Select the field to search' : `Select a value for ${fieldSelection[fieldSelection.length - 1].key}`;
            setLabel(newLabel);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
    };

    const onTokenRemove = (e) => {
        const newFieldSelection = [...fieldSelection];
        newFieldSelection.splice(e, 1);
        setFieldSelection(newFieldSelection);
    };

    useEffect(() => {
        const verifyKeySelection = () => {
            if (!fieldSelection) {
                setIsKeySelection(true);
            } else if (fieldSelection[fieldSelection.length - 1] && !fieldSelection[fieldSelection.length - 1].value) {
                setIsKeySelection(false);
            } else {
                setIsKeySelection(true);
            }
        };
        verifyKeySelection();
        if (typeof onFilterChange === 'function') {
            onFilterChange(fieldSelection);
        }
    }, [fieldSelection]);

    useEffect(() => {
        setNewTypeaheadList();
        setNewLabel();
    }, [isKeySelection]);

    useEffect(() => {
        setClear(false);
    }, [selected]);

    useEffect(() => {
        if (typeof onFilterChange === 'function') {
            onFilterChange(fieldSelection);
        }
    }, [valueToggle]);

    useEffect(() => {
        const newKeyTags = suggestions ? Object.keys(suggestions).map((x) => ({key: x})) : [{key: ''}];
        setKeyTags(newKeyTags);
        setTypeaheadList(newKeyTags);
    }, [suggestions]);

    const renderToken = (x, idx) => (
        <Token
            key={`token-${idx}`}
            id={idx}
            onRemove={onTokenRemove}
            value={x.value ? `${x.key} = ${x.value}` : `${x.key} = `}
        />
    );

    return (
        <div className="universal-search-bar">
            <SearchableList
                inputProps={{label, id: 'searchable-list-input'}}
                options={typeaheadList}
                labelKey="key"
                onChange={onChange}
                clear={clear}
                selected={selected}
            />
            <div className="tokens-container">
                {fieldSelection && fieldSelection.map(renderToken)}
            </div>
        </div>
    );
};

export default UniversalSearch;
