/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import './styles.less';
import {Checkbox} from '@homeaway/react-form-components';
import Select from 'react-select';

const tags = ['DEPLOYMENT'].map((a) => ({value: a, label: a}));
const portfolios = [];

const AnnotationsFilterPanel = ({
    enableAlerts,
    setEnableAlerts,
    selectedTags,
    setSelectedTags,
    selectedPortfolios,
    setSelectedPortfolios
}) => {
    const handlePortfoliosOnChange = (event) => {
        const newSelectedPortfolios = (event || []).map((item) => item.value);
        setSelectedPortfolios(newSelectedPortfolios);
    };

    const handleTagsOnChange = (event) => {
        const newSelectedTags = (event || []).map((item) => item.value);
        setSelectedTags(newSelectedTags);
    };

    return (
        <div className="filters-container">
            <div className="filter-option">
                <div className="filter-label-wrapper">
                    <p className="filter-label">Annotations</p>
                </div>
                <div className="filter-option-selection">
                    <Checkbox
                        name="alertsCheckbox"
                        label="Show Annotations"
                        checked={enableAlerts}
                        onChange={() => setEnableAlerts(!enableAlerts)}
                        size="sm"
                    />
                </div>
            </div>
            <div className="filter-option">
                <div className="filter-label-wrapper">
                    <p className="filter-label">Annotations Category</p>
                </div>
                <div className="filter-option-selection">
                    <Select
                        isMulti
                        value={selectedTags.map((v) => ({value: v, label: v}))}
                        options={tags}
                        onChange={handleTagsOnChange}
                    />
                </div>
            </div>
            <div className="filter-option">
                <div className="filter-label-wrapper">
                    <p className="filter-label">Portfolios</p>
                </div>
                <div className="filter-option-selection">
                    <Select
                        isMulti
                        value={selectedPortfolios.map((v) => ({value: v, label: v}))}
                        options={portfolios}
                        onChange={handlePortfoliosOnChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default AnnotationsFilterPanel;
