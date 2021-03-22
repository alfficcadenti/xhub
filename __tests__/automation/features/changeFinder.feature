Feature: Verify user is able to navigate around Change Finder

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Platform Health & Resiliency Button
    Then user verify platformHealthResiliencyDropdown exist
    Then user go ahead and clicks on the <link>
    Then user wait for the data to load
    Then the current page title contain Change Finder

    Examples:
    | brand                    | link                          |
    | ExpediaGroup             | platformHealthResiliencyLink4 |
    | Expedia                  | platformHealthResiliencyLink4 |
    | Egencia                  | platformHealthResiliencyLink4 |
    | Hotelscom                | platformHealthResiliencyLink5 |
    | Vrbo                     | platformHealthResiliencyLink4 |
    | ExpediaPartnerSolutions  | platformHealthResiliencyLink4 |
