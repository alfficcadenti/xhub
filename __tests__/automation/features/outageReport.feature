Feature: Verify user is able to navigate around Outage Report

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Outage Report Button
    Then user verify outageReportDropdown exist
    Then user go ahead and clicks on the <link>
    Then user wait for the data to load
    Then the current page title contain Outage Report

    Examples:
    | brand                   | link              |
    | ExpediaGroup            | outageReportLink1 |
    | Expedia                 | outageReportLink1 |
    | Egencia                 | outageReportLink1 |
    | Hotelscom               | outageReportLink1 |
    | Vrbo                    | outageReportLink1 |
    | ExpediaPartnerSolutions | outageReportLink1 |
