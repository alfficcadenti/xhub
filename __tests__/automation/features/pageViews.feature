Feature: Verify user is able to navigate around Page Views

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the <link>
    Then user wait for the data to load
    Then the current page title contain Page Views
    Then user selects one element of filter <businessButton> <businessOption>
    Then click on <reset>
    Then select annotations filter
    Then click on <dateButton>
    Then user selects start date
    Then user selects end date

    Examples:
    | brand                    | link                    | businessButton | businessOption       | dateButton    | reset        |
    | Expedia                  | availabilityTrendsLink3 | businessFilter | businessFilterOption | setDateButton | resetFilters |
    | Hotelscom                | availabilityTrendsLink3 | businessFilter | businessFilterOption | setDateButton | resetFilters |
    | Vrbo                     | availabilityTrendsLink2 | businessFilter | businessFilterOption | setDateButton | resetFilters |
    | ExpediaPartnerSolutions  | availabilityTrendsLink3 | businessFilter | businessFilterOption | setDateButton | resetFilters |
