Feature: Verify user is able to navigate around Success Rates

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the <link>
    Then user wait for the data to load
    Then the current page title contain Success Rates
    Then click on <lobClearFilters>
    Then wait for data reload <realTimeSuccessRates> <realTimeSuccessRatesLoader>
    Then user selects one element of filter <businessFilter> <businessFilterOptionExpedia>
    Then wait for data reload <realTimeSuccessRates> <realTimeSuccessRatesLoader>
    Then select annotations filter
    Then click on setDateButton
    Then user selects start date
    Then user selects end date
    Then click on applyButton
    Then user wait for the data to load
    Then click on setDateButton
    Then user selects one element of filter setTimeFilter setTimeFilterOption
    Then click on applyButton
    Then user wait for the data to load
    Then click on resetGraph
    Then user wait for the data to load

    Examples:
    | brand     | link                    | lobClearFilters | realTimeSuccessRates | realTimeSuccessRatesLoader | businessFilter | businessFilterOptionExpedia |
    | Expedia   | availabilityTrendsLink4 | lobClearFilters | realTimeSuccessRates | realTimeSuccessRatesLoader | businessFilter | businessFilterOptionExpedia |
    | Hotelscom | availabilityTrendsLink7 |                 |                      |                            |                |                             |
    | Vrbo      | availabilityTrendsLink3 |                 |                      |                            |                |                             |
