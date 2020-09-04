/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useEffect, useState} from 'react';
import 'moment-timezone';
import './styles.less';
import {Checkbox} from '@homeaway/react-form-components';
import Select from 'react-select';
import {useFetchProductMapping} from '../../pages/hooks';

const annotationCategories = [{value: 'Application Software', label: 'Deployments'}].map(({value, label}) => ({value, label}));

const AnnotationsFilterPanel = ({
    enableAlerts,
    setEnableAlerts,
    selectedCategories,
    setSelectedCategories,
    selectedProducts,
    setSelectedProducts,
    selectedApplications,
    setSelectedApplications,
    start,
    end
}) => {
    const [products, setProducts] = useState([]);
    const [applications, setApplications] = useState([]);

    const productMapping = useFetchProductMapping(start, end);

    useEffect(() => {
        const adjustedProducts = productMapping.map(({productName}) => ({value: productName, label: productName}));
        setProducts(adjustedProducts);
    }, [productMapping]);

    const handleProductsOnChange = (event) => {
        const newSelectedProducts = (event || []).map((item) => item.value);
        setSelectedProducts(newSelectedProducts);
        // remove selections from applicationNames when there's no product selected
        if (!newSelectedProducts.length) {
            setSelectedApplications([]);
        }
        const adjustedApplications = newSelectedProducts.reduce((acc, current) => {
            const currentApplicationNames = productMapping.find((item) => item.productName === current).applicationNames;
            return [...acc, ...currentApplicationNames];
        }, []);
        setApplications(adjustedApplications.map((a) => ({value: a, label: a})));
    };

    const handleApplicationsOnChange = (event) => {
        const newSelectedApplications = (event || []).map((item) => item.value);
        setSelectedApplications(newSelectedApplications);
    };

    const handleCategoriesOnChange = (event) => {
        const newSelectedAnnotationCategories = (event || []).map(({value, label}) => ({value, label}));
        setSelectedCategories(newSelectedAnnotationCategories);
    };

    return (
        <div className="filters-container">
            <div className="filter-option">
                <div className="filter-label-wrapper">
                    <p className="filter-label">{'Annotations'}</p>
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
                    <p className="filter-label">{'Annotations Category'}</p>
                </div>
                <div className="filter-option-selection">
                    <Select
                        isMulti
                        value={selectedCategories.map(({value, label}) => ({value, label}))}
                        options={annotationCategories}
                        onChange={handleCategoriesOnChange}
                    />
                </div>
            </div>
            <div className="filter-option">
                <div className="filter-label-wrapper">
                    <p className="filter-label">{'Products'}</p>
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
                    <p className="filter-label">{'Applications'}</p>
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
