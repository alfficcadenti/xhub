Feature: Verify user is able to navigate around Incident Trends

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Platform Health & Resiliency Button
    Then user verify platformHealthResiliencyDropdown exist
    Then user go ahead and clicks on the <link>
    Then the current page title contain Incident Trends

    Examples:
    | brand                    | link                          |
    | ExpediaGroup             | platformHealthResiliencyLink1 |
    | Expedia                  | platformHealthResiliencyLink1 |
    | Egencia                  | platformHealthResiliencyLink1 |
    | Hotelscom                | platformHealthResiliencyLink1 |
    | Vrbo                     | platformHealthResiliencyLink1 |
    | ExpediaPartnerSolutions  | platformHealthResiliencyLink1 |
