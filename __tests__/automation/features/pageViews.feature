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
    Then user selects one element of filter <partnerButton> <partnerOption>
    Then user wait for the data to load
    Then conditional click on <reset> <skipPartner>
    Then user selects one element of filter <businessButton> <businessOption>
    Then conditional click on <reset> <skipBusiness>
    Then select annotations filter
    Then click on <dateButton>
    Then user selects start date
    Then user selects end date
    Then click on <applyButton>
    Then user wait for the data to load
    Then click on <dateButton>
    Then user selects one element of filter <setTimeFilter> <setTimeFilterOption>
    Then click on <applyButton>
    Then user wait for the data to load
    Then click on <resetGraph>
    Then user wait for the data to load

    Examples:
    | brand                    | link                    | businessButton | businessOption       | dateButton    | reset        | applyButton | setTimeFilter | setTimeFilterOption | partnerButton | partnerOption       | resetGraph | skipPartner | skipBusiness |
    | Expedia                  | availabilityTrendsLink3 | businessFilter | businessFilterOption | setDateButton | resetFilters | applyButton | setTimeFilter | setTimeFilterOption |               |                     | resetGraph | true        |              |
    | Hotelscom                | availabilityTrendsLink3 |                |                      | setDateButton | resetFilters | applyButton | setTimeFilter | setTimeFilterOption |               |                     | resetGraph | true        | true         |
    | Vrbo                     | availabilityTrendsLink2 |                |                      | setDateButton | resetFilters | applyButton | setTimeFilter | setTimeFilterOption |               |                     | resetGraph | true        | true         |
    | ExpediaPartnerSolutions  | availabilityTrendsLink3 | businessFilter | businessFilterOption | setDateButton | resetFilters | applyButton | setTimeFilter | setTimeFilterOption | partnerFilter | partnerFilterOption | resetGraph |             |              |
