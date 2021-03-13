Feature: Verify user is able to navigate around homepage

  @acceptance @desktop @only
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Availability & Trends-dropdown
    Then user verify impulseDashboardLink exist
    Then user go ahead and clicks on the impulseDashboardLink
    Then the current page title contain Impulse Dashboard

    Examples:
    | brand         |
    | ExpediaGroup  |
