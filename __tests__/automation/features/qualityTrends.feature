Feature: Verify user is able to navigate around Quality Trends

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Platform Health & Resiliency Button
    Then user verify platformHealthResiliencyDropdown exist
    Then user go ahead and clicks on the <link>
    Then the current page title contain Quality Trends

    Examples:
    | brand                    | link                          |
    | ExpediaGroup             | platformHealthResiliencyLink2 |
    | Expedia                  | platformHealthResiliencyLink2 |
    | Egencia                  | platformHealthResiliencyLink2 |
    | Hotelscom                | platformHealthResiliencyLink2 |
    | Vrbo                     | platformHealthResiliencyLink2 |
    | ExpediaPartnerSolutions  | platformHealthResiliencyLink2 |
