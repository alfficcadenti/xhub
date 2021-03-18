Feature: Verify user is able to navigate around Impulse Dashboard

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the <link>
    Then the current page title contain Impulse Dashboard

    Examples:
    | brand                    | link                    |
    | ExpediaGroup             | availabilityTrendsLink1 |
    | Expedia                  | availabilityTrendsLink1 |
    | Egencia                  | availabilityTrendsLink1 |
    | Hotelscom                | availabilityTrendsLink2 |
    | Vrbo                     | availabilityTrendsLink1 |
    | ExpediaPartnerSolutions  | availabilityTrendsLink1 |
