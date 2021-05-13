Feature: Verify user is able to navigate around Operational iOS Dashboard

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the <link>
    Then user wait for the data to load
    Then the current page title contain Operational iOS Dashboard

    Examples:
    | brand     | link                    |
    | Hotelscom | availabilityTrendsLink6 |
