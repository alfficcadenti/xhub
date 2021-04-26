Feature: Verify user is able to navigate around FCI

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the <link>
    Then user wait for the data to load
    Then the current page title contain FCI
    Then click on errorCodeCheckbox
    Then user wait for the data to load
    Then click on categoryCheckbox
    Then user wait for the data to load
    Then user selects start date
    Then user selects end date
    Then user selects one element of filter errorsFilter errorsFilterOption
    Then click on applyButton
    Then user wait for the data to load
    Then click on resetFilters
    Then user selects one element of filter sitesFilter sitesFilterOption
    Then click on applyButton
    Then user wait for the data to load
    Then click on resetFilters
    Then click on applyButton
    Then user wait for the data to load
    Then click on hideIntentionalErrorsInput
    Then click on applyButton
    Then user wait for the data to load
    Then user selects one element of filter setTimeFilter setTimeFilterOption
    Then click on applyButton
    Then user wait for the data to load
    Then click on subpageLinkFci2
    Then waiting for fciSearchInput
    Then set value of input fciSearchInput
    Then click on applyButton
    Then waiting for modalContainer
    Then user wait for the data to load
    Then set value of input modalSearchInput
    Then click on modalSettingsButton
    Then waiting for modalMoreSettingsContainer
    Then click on modalCloseButton

    Examples:
    | brand                    | link                    |
    | Expedia                  | availabilityTrendsLink2 |
    | ExpediaPartnerSolutions  | availabilityTrendsLink2 |
