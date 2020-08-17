/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import 'moment-timezone';
import './styles.less';
import {Checkbox} from '@homeaway/react-form-components';
import Select from 'react-select';
import {checkResponse} from '../../pages/utils';

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
    const [productMapping, setProductMapping] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchProductMapping = () => {
            const dateQuery = start && end
                ? `startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
                : '';
            fetch(`/productMapping?${dateQuery}`)
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
        // remove selections from applicationNames when there's no product selected
        if (!newSelectedProducts.length) {
            setSelectedApplications([]);
        }
        const adjustedApplications = newSelectedProducts.reduce((acc, currrent) => {
            const currentApplicationNames = productMapping.find((item) => item.productName === currrent).applicationNames;
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
