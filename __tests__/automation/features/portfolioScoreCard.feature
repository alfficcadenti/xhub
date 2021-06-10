Feature: Verify user is able to navigate around Portfolio ScoreCard

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Platform Health & Resiliency Button
    Then user verify platformHealthResiliencyDropdown exist
    Then user go ahead and clicks on the <link>
    Then user wait for the data to load
    Then the current page title contain Portfolio ScoreCard
    Then user selects start date
    Then user selects end date
    Then click on submitFilters
    Then user wait for the data to load

    Examples:
      | brand                    | link                          |
      | ExpediaGroup             | platformHealthResiliencyLink3 |
      | Expedia                  | platformHealthResiliencyLink3 |
      | Egencia                  | platformHealthResiliencyLink3 |
      | Hotelscom                | platformHealthResiliencyLink3 |
      | Vrbo                     | platformHealthResiliencyLink3 |
      | ExpediaPartnerSolutions  | platformHealthResiliencyLink3 |