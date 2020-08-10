/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import './styles.less';
import {Checkbox} from '@homeaway/react-form-components';
import Select from 'react-select';

const tags = ['DEPLOYMENT'].map((a) => ({value: a, label: a}));
const applications = [];
const products = [];

const AnnotationsFilterPanel = ({
    enableAlerts,
    setEnableAlerts,
    selectedTags,
    setSelectedTags,
    selectedProducts,
    setSelectedProducts,
    selectedApplications,
    setSelectedApplications
}) => {
    const handleProductsOnChange = (event) => {
        const newSelectedProducts = (event || []).map((item) => item.value);
        setSelectedProducts(newSelectedProducts);
    };

    const handleApplicationsOnChange = (event) => {
        const newSelectedApplications = (event || []).map((item) => item.value);
        setSelectedApplications(newSelectedApplications);
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
                    <p className="filter-label">Products</p>
                </div>
                <div className="filter-option-selection">
                    <Select
                        isMulti
                        value={selectedProducts.map((v) => ({value: v, label: v}))}
                        options={products}
                        onChange={handleProductsOnChange}
                    />
                </div>
            </div>
            <div className="filter-option">
                <div className="filter-label-wrapper">
                    <p className="filter-label">Applications</p>
                </div>
                <div className="filter-option-selection">
                    <Select
                        isMulti
                        value={selectedApplications.map((v) => ({value: v, label: v}))}
                        options={applications}
                        onChange={handleApplicationsOnChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default AnnotationsFilterPanel;
