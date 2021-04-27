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
    Then conditional click on paginationNextBtn paginationNextBtn
    Then conditional click on paginationPrevBtn paginationPrevBtn
    Then conditional click on paginationNumberBtn paginationNumberBtn
    Then user selects one element of filter pageSizeDropdown pageSizeDropdownListElement
    Then user selects start date
    Then user selects end date
    Then click on submitFilters
    Then user wait for the data to load
    Then click on searchListInput
    Then waiting for searchListMenuListElement
    Then click on searchListMenuListElement
    Then waiting for filterToken
    Then click on searchListInput
    Then waiting for searchListMenuListElement
    Then click on searchListMenuListElement
    Then click on filterTokenRemove
    Then click on linkToSecondSubpage
    Then click on linkToFirstSubpage

    Examples:
    | brand                    | link                          |
    | ExpediaGroup             | platformHealthResiliencyLink4 |
    | Expedia                  | platformHealthResiliencyLink4 |
    | Egencia                  | platformHealthResiliencyLink4 |
    | Hotelscom                | platformHealthResiliencyLink5 |
    | Vrbo                     | platformHealthResiliencyLink4 |
    | ExpediaPartnerSolutions  | platformHealthResiliencyLink4 |
