import React, {useState, useEffect} from 'react';
import './styles.less';
import {SearchableList} from '@homeaway/react-searchable-list';
import {Token} from '@homeaway/react-input-tokenize';

const UniversalSearch = (props) => {
    const [keyTags, setKeyTags] = useState([]);
    const [selected, setSelected] = useState([]);
    const [typeaheadList, setTypeaheadList] = useState(keyTags);
    const [isKeySelection, setIsKeySelection] = useState(true);
    const [fieldSelection, setFieldSelection] = useState([]);
    const [clear, setClear] = useState(false);
    const [label, setLabel] = useState('Select the field to search');
    const [valueToggle, setValueToggle] = useState(false);

    const onClear = () => {
        setSelected([]);
        setClear(true);
        document.activeElement.blur();
    };

    const onChange = ([selection]) => {
        try {
            const newFieldSelection = [...fieldSelection];
            if (isKeySelection) {
                newFieldSelection.push({key: selection.key, value: ''});
            } else {
                setValueToggle(!valueToggle);
                newFieldSelection[newFieldSelection.length - 1].value = selection;
            }
            setFieldSelection(newFieldSelection);
            setIsKeySelection(!isKeySelection);
            onClear();
        } catch (e) {
            console.log(e);
        }
    };

    const selectedProduct = () => {
        const product = fieldSelection && fieldSelection.length && fieldSelection.find((x) => x.key === 'productName');
        return product;
    };

    const productApplications = (product) => {
        const productMappingOBj = props.suggestionMapping.find((x) => x.productName === product);
        return productMappingOBj && productMappingOBj.applicationNames ? productMappingOBj.applicationNames : '';
    };

    const setNewTypeaheadList = () => {
        try {
            if (isKeySelection) {
                setTypeaheadList(keyTags);
            } else {
                const product = selectedProduct();
                const currentFilter = fieldSelection && fieldSelection.length && fieldSelection[fieldSelection.length - 1];
                if (product && product.value && currentFilter.key === 'applicationName') {
                    const newList = productApplications(product.value) ?
                        productApplications(product.value) :
                        props.suggestions[fieldSelection[fieldSelection.length - 1].key];
                    setTypeaheadList(newList);
                } else {
                    const newList = props.suggestions[fieldSelection[fieldSelection.length - 1].key];
                    setTypeaheadList(newList);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const setNewLabel = () => {
        try {
            const newLabel = isKeySelection ? 'Select the field to search' : `Select a value for ${fieldSelection[fieldSelection.length - 1].key}`;
            setLabel(newLabel);
        } catch (e) {
            console.log(e);
        }
    };

    const verifyKeySelection = () => {
        if (!fieldSelection) {
            setIsKeySelection(true);
        } else if (fieldSelection[fieldSelection.length - 1] && !fieldSelection[fieldSelection.length - 1].value) {
            setIsKeySelection(false);
        } else {
            setIsKeySelection(true);
        }
    };

    const onTokenRemove = (e) => {
        const newFieldSelection = [...fieldSelection];
        newFieldSelection.splice(e, 1);
        setFieldSelection(newFieldSelection);
    };

    useEffect(() => {
        verifyKeySelection();
        props.onFilterChange(fieldSelection);
    }, [fieldSelection]);

    useEffect(() => {
        setNewTypeaheadList();
        setNewLabel();
    }, [isKeySelection]);

    useEffect(() => {
        setClear(false);
    }, [selected]);

    useEffect(() => {
        props.onFilterChange(fieldSelection);
    }, [valueToggle]);

    useEffect(() => {
        const newKeyTags = props.suggestions ? Object.keys(props.suggestions).map((x) => ({'key': x})) : [{'key': ''}];
        setKeyTags(newKeyTags);
        setTypeaheadList(newKeyTags);
    }, [props.suggestions]);

    return (<div className="universal-search-bar">

        <SearchableList
            inputProps={{
                label,
                id: 'searchable-list-input'
            }}
            options={typeaheadList}
            labelKey="key"
            onChange={onChange}
            clear={clear}
            selected={selected}
        />
        <div className="tokens-container">
            {fieldSelection ?
                fieldSelection.map((x, idx) => (<Token
                    key={`token-${idx}`}
                    id={idx}
                    onRemove={onTokenRemove}
                    value={x.value ? `${x.key} = ${x.value}` : `${x.key} = `}
                />))
                : ''}
        </div>
    </div>
    );
};

export default UniversalSearch;