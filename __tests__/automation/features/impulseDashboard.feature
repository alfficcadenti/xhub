Feature: Verify user is able to navigate around Impulse Dashboard

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the <link>
    Then user wait for the data to load
    Then the current page title contain Impulse Dashboard
    Then user selects start date
    Then user selects end date
    Then user selects brand filter
    Then submit filters
    Then user wait for the data to load
    Then reset filters
    Then user selects lob filter
    Then submit filters
    Then user wait for the data to load
    Then reset filters
    Then user selects pos filter
    Then submit filters
    Then user wait for the data to load
    Then reset filters
    Then select incidents filter
    Then reset filters
    Then select anomalies filter
    Then reset filters
    Then select checkboxes
    Then select advance filters
    Then submit filters
    Then user wait for the data to load
    Then reset filters
    Then set time filter
    Then submit filters
    Then user wait for the data to load
    Then reset graph
    Then user wait for the data to load

    Examples:
    | brand                    | link                    |
    | ExpediaGroup             | availabilityTrendsLink1 |
    | Expedia                  | availabilityTrendsLink1 |
    | Egencia                  | availabilityTrendsLink1 |
    | Hotelscom                | availabilityTrendsLink2 |
    | Vrbo                     | availabilityTrendsLink1 |
    | ExpediaPartnerSolutions  | availabilityTrendsLink1 |