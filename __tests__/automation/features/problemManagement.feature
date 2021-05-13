Feature: Verify user is able to navigate around Problem Management

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Platform Health & Resiliency Button
    Then user verify platformHealthResiliencyDropdown exist
    Then user go ahead and clicks on the <link>
    Then user wait for the data to load
    Then the current page title contain Problem Management
    Then waiting for chartsContainer
    Then click on linkToFirstSubpage
    Then click on linkToSecondSubpage
    Then waiting for ticketsContainer
    Then user selects start date
    Then user selects end date
    Then user selects one element of filter owningOrgsFilter owningOrgsFilterOption
    Then user selects one element of filter priorityDropdown priorityDropdownOption
    Then user selects one element of filter typeFilter typeFilterOption
    Then click on moreFiltersButton
    Then waiting for moreFiltersContainer
    Then user selects one element of filter statusDropdown statusDropdownOption
    Then user selects one element of filter rootCauseOwnerFilter rootCauseOwnerFilterOption
    Then user selects one element of filter rootCauseCategoriesFilter rootCauseCategoriesFilterOption
    Then click on submitFilters
    Then click on linkToThirdSubpage
    Then waiting for correctiveActionsContainer
    Then click on removeCorrectiveActionsFilters
    Then click on submitFilters
    Then user wait for the data to load
    Then select Corrective Actions
    Then user selects one element of filter statusFilter statusFilterOption
    Then click on submitFilters

    Examples:
    | brand                    | link                          |
    | ExpediaGroup             | platformHealthResiliencyLink3 |
    | Expedia                  | platformHealthResiliencyLink3 |
    | Egencia                  | platformHealthResiliencyLink3 |
    | Hotelscom                | platformHealthResiliencyLink3 |
    | Vrbo                     | platformHealthResiliencyLink3 |
    | ExpediaPartnerSolutions  | platformHealthResiliencyLink3 |
