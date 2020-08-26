import React, {useState, useEffect} from 'react';
import './styles.less';
import {SearchableList} from '@homeaway/react-searchable-list';
import {Token} from '@homeaway/react-input-tokenize';

const UniversalSearch = (props) => {
    const [keyTags, setKeyTags] = useState([]);
    const [selected, setSelected] = useState([]);
    const [typeaheadList, setTypeaheadList] = useState(keyTags);
    const [isKeySelection, setIsKeySelection] = useState(true);
    const [fieldSelection, setFieldSelection] = useState({key: '', value: ''});
    const [clear, setClear] = useState(false);
    const [label, setLabel] = useState('Select the field to search');

    const onClear = () => {
        setSelected([]);
        setClear(true);
        document.activeElement.blur();
    };

    const onChange = (i) => {
        const newObj = {...fieldSelection};
        if (isKeySelection) {
            newObj.key = i[0].key;
        } else {
            newObj.value = i[0];
        }
        setFieldSelection(newObj);
        setIsKeySelection(!isKeySelection);
        onClear();
    };

    const setNewTypeaheadList = () => {
        const newList = !isKeySelection ? props.suggestions[fieldSelection.key] : keyTags;
        setTypeaheadList(newList);
    };

    const setNewLabel = () => {
        const newLabel = isKeySelection ? 'Select the field to search' : `Select a value for ${fieldSelection.key}`;
        setLabel(newLabel);
    };

    const onTokenRemove = () => {
        setFieldSelection({key: '', value: ''});
        setIsKeySelection(true);
    };

    useEffect(() => {
        setNewTypeaheadList();
        setNewLabel();
    }, [isKeySelection]);

    useEffect(() => {
        setClear(false);
    }, [selected]);

    useEffect(() => {
        props.onFilterChange(fieldSelection);
    }, [fieldSelection.value]);

    useEffect(() => {
        const newKeyTags = props.suggestions ? Object.keys(props.suggestions).map((x) => ({'key': x})) : [{'key': ''}];
        setKeyTags(newKeyTags);
        setTypeaheadList(newKeyTags);
    }, [props.suggestions]);

    return (<div className="universal-search-bar">
        {fieldSelection.key ?
            <Token
                id="token"
                onRemove={onTokenRemove}
                value={fieldSelection.value ? `${fieldSelection.key} = ${fieldSelection.value}` : `${fieldSelection.key} = `}
            /> : ''}
        {!fieldSelection.value ? <SearchableList
            inputProps={{
                label,
                id: 'searchable-list-input'
            }}
            options={typeaheadList}
            labelKey="key"
            onChange={onChange}
            clear={clear}
            selected={selected}
        /> : ''}
    </div>
    );
};

export default UniversalSearch;