module.exports = {
    elements: {
        dateStart: {
            selector: 'div.rdt:nth-child(1)'
        },
        dateEnd: {
            selector: 'div.rdt:nth-child(2)'
        },
        datePicker: {
            selector: '.rdtOpen .rdtPicker'
        },
        dateTimeToggle: {
            selector: '.rdtOpen .rdtTimeToggle'
        },
        dateSwitch: {
            selector: '.rdtOpen .rdtSwitch'
        },
        datePrev: {
            selector: '.rdtOpen .rdtPrev'
        },
        dateNext: {
            selector: '.rdtOpen .rdtNext'
        },
        dateYear: {
            selector: '.rdtOpen tr:nth-child(1) .rdtYear:nth-child(3)'
        },
        dateMonth: {
            selector: '.rdtOpen tr:nth-child(1) .rdtMonth:nth-child(3)'
        },
        dateDay: {
            selector: '.rdtOpen tr:nth-child(4) .rdtDay:nth-child(6)'
        },
        dateEndMonth: {
            selector: '.rdtOpen tr:nth-child(1) .rdtMonth:nth-child(4)'
        },
        dateEndDay: {
            selector: '.rdtOpen tr:nth-child(3) .rdtDay:nth-child(6)'
        },
        brandFilter: {
            selector: '.filter-option:nth-child(2) .filter-option-selection:nth-child(1)'
        },
        lobFilter: {
            selector: '.filter-option:nth-child(2) .filter-option-selection:nth-child(2)'
        },
        incidentsFilter: {
            selector: '.filter-option:nth-child(3) .filter-option-selection'
        },
        anomaliesFilter: {
            selector: '.filter-option:nth-child(5) .filter-option-selection'
        },
        deviceFilter: {
            selector: '.filter-option:nth-child(1) .filter-option-selection'
        },
        posFilter: {
            selector: '.filter-option-expand'
        },
        brandOptionFilter1: {
            selector: '.filter-option-selection #react-select-3-option-0'
        },
        brandOptionFilter2: {
            selector: '.filter-option-selection #react-select-3-option-1'
        },
        lobOptionFilter: {
            selector: '.filter-option-selection #react-select-4-option-0'
        },
        posOptionFilter: {
            selector: '.filter-option-expand #react-select-5-option-0'
        },
        incidentsOptionFilter: {
            selector: '.filter-option-selection #react-select-6-option-0'
        },
        anomaliesOptionFilter: {
            selector: '.filter-option-selection #react-select-7-option-2'
        },
        deviceOptionFilter: {
            selector: '.filter-option-selection #react-select-8-option-0'
        },
        submitFilters: {
            selector: '.apply-button'
        },
        resetFilters: {
            selector: '.css-tlfecz-indicatorContainer:nth-child(1)'
        },
        incidentsCheckbox: {
            selector: 'input[name="incidents-сheckbox"]'
        },
        anomaliesCheckbox: {
            selector: 'input[name="Anomalies-сheckbox"]'
        },
        moreFiltersButton: {
            selector: '.more-filters-btn'
        },
        advanceFiltersContainer: {
            selector: '.advance-filters-divider'
        },
        setTimeFilter: {
            selector: '.rdt-preset-dropdown'
        },
        setTimeFilterOption: {
            selector: '#rdt-preset-dropdown--container li:nth-child(1)'
        },
        resetGraph: {
            selector: '.reset-btn'
        },
        businessFilter: {
            selector: '.lob-select__control'
        },
        businessFilterOptionExpedia: {
            selector: '.lob-select__menu-list #react-select-3-option-0'
        },
        businessFilterOptionEps: {
            selector: '.lob-select__menu-list #react-select-4-option-0'
        },
        resetFilterButton: {
            selector: '.css-tlfecz-indicatorContainer:nth-child(1)'
        },
        annotationsButton: {
            selector: '.display-annotations-btn'
        },
        annotationsContainer: {
            selector: '.open.annotations-wrapper'
        },
        annotationsSearchInput: {
            selector: 'input[id="searchable-list-input"]'
        },
        annotationsRemoveButton: {
            selector: '.annotations-filters-container .Token__remove'
        },
        annotationsDeploymentsInput: {
            selector: '.annotations-filters-container .annotations-category-filters input[name="deployment-сheckbox"]'
        },
        setDateButton: {
            selector: '.dates-button'
        },
        applyButton: {
            selector: '.apply-btn'
        },
        partnerFilter: {
            selector: '.eps-partner-select__control'
        },
        partnerFilterOption: {
            selector: '#react-select-3-option-0'
        },
        paginationPrevBtn: {
            selector: '.pagination .btn-group button:nth-child(1)'
        },
        paginationNextBtn: {
            selector: '.pagination .btn-group button:nth-child(5)'
        },
        paginationNumberBtn: {
            selector: '.pagination .btn-group button:nth-child(4)'
        },
        pageSizeDropdown: {
            selector: '#pagesize-dropdown'
        },
        pageSizeDropdownListElement: {
            selector: '#pagesize-dropdown--container li:nth-child(4)'
        },
        priorityDropdown: {
            selector: '#priority-dropdown'
        },
        priorityDropdownOption: {
            selector: '#priority-dropdown--container li:nth-child(3)'
        },
        statusDropdown: {
            selector: '#status-dropdown'
        },
        statusDropdownOption: {
            selector: '#status-dropdown--container li:nth-child(3)'
        },
        tagDropdown: {
            selector: '#tag-dropdown'
        },
        tagDropdownOption: {
            selector: '#tag-dropdown--container li:nth-child(3)'
        },
        partnerDropdown: {
            selector: '#partner-dropdown'
        },
        partnerDropdownOption: {
            selector: '#partner-dropdown--container li:nth-child(3)'
        },
        chartsContainer: {
            selector: '.overview-charts'
        },
        ticketsContainer: {
            selector: '.data-table__container'
        },
        linkToFirstSubpage: {
            selector: '.Navigation__ul li:nth-child(1)'
        },
        linkToSecondSubpage: {
            selector: '.Navigation__ul li:nth-child(2)'
        },
        linkToThirdSubpage: {
            selector: '.Navigation__ul li:nth-child(3)'
        },
        owningOrgsFilter: {
            selector: '#org-dropdown'
        },
        owningOrgsFilterOption: {
            selector: '#org-dropdown--container li:nth-child(2)'
        },
        typeFilter: {
            selector: '#type-dropdown'
        },
        typeFilterOption: {
            selector: '#type-dropdown--container li:nth-child(2)'
        },
        rootCauseOwnerFilter: {
            selector: '#rc-owner-dropdown'
        },
        rootCauseOwnerFilterOption: {
            selector: '#rc-owner-dropdown--container li:nth-child(2)'
        },
        rootCauseCategoriesFilter: {
            selector: '#rcCategory-dropdown'
        },
        rootCauseCategoriesFilterOption: {
            selector: '#rcCategory-dropdown--container li:nth-child(2)'
        },
        moreFiltersContainer: {
            selector: '#more-filters-divider'
        },
        removeCorrectiveActionsFilters: {
            selector: '.status-select__clear-indicator svg'
        },
        correctiveActionsContainer: {
            selector: '.l1-table.l-table'
        },
        correctiveActionsModalOpener: {
            selector: '.l1-table .count'
        },
        correctiveActionsModalContainer: {
            selector: '#corrective-actions-modal'
        },
        correctiveActionsModalSettingsButton: {
            selector: '.Modal__body .settings-btn:nth-child(2)'
        },
        correctiveActionsModalSettingsContainer: {
            selector: '.Modal__content .CollapseBase__content'
        },
        correctiveActionsModalSettingsInput: {
            selector: '.CollapseBase__content.Divider__body input'
        },
        l1TableArrow: {
            selector: '.l1-table .arrow'
        },
        l2TableContainer: {
            selector: '.l2-table'
        },
        l2TableArrow: {
            selector: '.l2-table .arrow'
        },
        l3TableContainer: {
            selector: '.l3-table'
        },
        l3TableArrow: {
            selector: '.l3-table .arrow'
        },
        l4TableContainer: {
            selector: '.l4-table'
        },
        l4TableArrow: {
            selector: '.l4-table .arrow'
        },
        l5TableContainer: {
            selector: '.l5-table'
        },
        statusFilter: {
            selector: '.status-select__control'
        },
        statusFilterOption: {
            selector: '.status-select__menu #react-select-3-option-0'
        },
        lobClearFilters: {
            selector: '.lob-select__clear-indicator'
        },
        realTimeSuccessRates: {
            selector: '.real-time-card-container'
        },
        realTimeSuccessRatesLoader: {
            selector: '.summary-container .LoadingOverlay'
        },
        errorsFilter: {
            selector: '.error-code-dropdown__control'
        },
        errorsFilterOption: {
            selector: '.error-code-dropdown #react-select-3-option-0'
        },
        sitesFilter: {
            selector: '.site-dropdown__control'
        },
        sitesFilterOption: {
            selector: '.site-dropdown__menu #react-select-4-option-0'
        },
        hideIntentionalErrorsInput: {
            selector: 'input[name="intent-cbox"]'
        },
        errorCodeCheckbox: {
            selector: 'input[value="errorCode"]'
        },
        categoryCheckbox: {
            selector: 'input[value="category"]'
        },
        subpageLinkFci1: {
            selector: '.Navigation__ul li:nth-child(1)'
        },
        subpageLinkFci2: {
            selector: '.Navigation__ul li:nth-child(2)'
        },
        fciSearchInput: {
            selector: '.fci-search-input .form-control'
        },
        modalContainer: {
            selector: '.Modal__content'
        },
        modalSearchInput: {
            selector: '.table-search-input .form-control'
        },
        modalSettingsButton: {
            selector: '.Modal__content .settings-btn'
        },
        modalMoreSettingsContainer: {
            selector: '.Modal__content .CollapseBase__content'
        },
        modalCloseButton: {
            selector: '.Modal__header-btn--close'
        },
        overviewTab: {
            selector: '.Navigation a[data-index="0"]'
        },
        overviewTabContainer: {
            selector: '#inc-overview-table'
        },
        top5Tab: {
            selector: '.Navigation a[data-index="2"]'
        },
        top5TabContainer: {
            selector: '#inc-top5-tables'
        },
        incidentsTab: {
            selector: '.Navigation a[data-index="1"]'
        },
        searchListInput: {
            selector: '.SearchListInput input.form-control'
        },
        searchListMenuList: {
            selector: '.SearchListMenu__ul'
        },
        searchListMenuListElement: {
            selector: '.SearchListMenu__ul li:nth-child(1)'
        },
        filterToken: {
            selector: '.tokens-container .Token'
        },
        filterTokenRemove: {
            selector: '.tokens-container .Token .Token__remove'
        },
        checkoutInput: {
            selector: 'input[name="Checkout"]'
        },
        customerInput: {
            selector: 'input[name="Customer"]'
        },
        qualityMetricsPanelContainer: {
            selector: '.panels-container .quality-panel:nth-child(1)'
        },
        qualityMetricsNoResultsContainer: {
            selector: '.no-results'
        },
        qualityMetricsPanelCountLink: {
            selector: '.panels-container .quality-panel:nth-child(1) tr:nth-child(1) td:nth-child(4) .count-link:nth-child(1)'
        }
    }
};
