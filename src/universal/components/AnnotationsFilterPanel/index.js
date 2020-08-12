/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useEffect, useState} from 'react';
import './styles.less';
import {Checkbox} from '@homeaway/react-form-components';
import Select from 'react-select';
import {checkResponse} from '../../pages/utils';

const annotationCategories = ['Application Software'].map((a) => ({value: a, label: a}));

const AnnotationsFilterPanel = ({
    enableAlerts,
    setEnableAlerts,
    selectedCategories,
    setSelectedCategories,
    selectedProducts,
    setSelectedProducts,
    selectedApplications,
    setSelectedApplications
}) => {
    const [products, setProducts] = useState([]);
    const [productMapping, setProductMapping] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchProductMapping = () => {
            fetch('/productMapping')
                .then(checkResponse)
                .then((mapping) => {
                    setProductMapping(mapping);
                    const adjustedProducts = mapping.map((item) => ({value: item.productName, label: item.productName}));
                    setProducts(adjustedProducts);
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        };

        fetchProductMapping();
    }, []);

    const handleProductsOnChange = (event) => {
        const newSelectedProducts = (event || []).map((item) => item.value);
        setSelectedProducts(newSelectedProducts);

        const adjustedApplications = newSelectedProducts.reduce((acc, currrent) => {
            const currentApplicationNames = productMapping.find((item) => item.productName === currrent).applicationNames;

            return [
                ...acc,
                ...currentApplicationNames
            ];
        }, []);
        setApplications(adjustedApplications.map((a) => ({value: a, label: a})));
    };

    const handleApplicationsOnChange = (event) => {
        const newSelectedApplications = (event || []).map((item) => item.value);
        setSelectedApplications(newSelectedApplications);
    };

    const handleCategoriesOnChange = (event) => {
        const newSelectedAnnotationCategories = (event || []).map((item) => item.value);
        setSelectedCategories(newSelectedAnnotationCategories);
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
                        value={selectedCategories.map((v) => ({value: v, label: v}))}
                        options={annotationCategories}
                        onChange={handleCategoriesOnChange}
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
