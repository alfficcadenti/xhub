Feature: Verify user is able to navigate around Incident Trends

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Platform Health & Resiliency Button
    Then user verify platformHealthResiliencyDropdown exist
    Then user go ahead and clicks on the <link>
    Then user wait for the data to load
    Then the current page title contain Incident Trends
    Then user selects start date
    Then user selects end date
    Then conditional click on paginationNextBtn <paginationNextBtn>
    Then conditional click on paginationPrevBtn <paginationPrevBtn>
    Then conditional click on paginationNumberBtn <paginationNumberBtn>
    Then user selects one element of filter <pageSizeDropdown> pageSizeDropdownListElement
    Then user selects one element of filter priorityDropdown priorityDropdownOption
    Then user selects one element of filter statusDropdown statusDropdownOption
    Then user selects one element of filter tagDropdown tagDropdownOption
    Then click on moreFiltersButton
    Then waiting for moreFiltersContainer
    Then user selects one element of filter rootCauseOwnerFilter rootCauseOwnerFilterOption
    Then click on submitFilters

    Examples:
      | brand                    | link                          | paginationNextBtn | paginationPrevBtn | paginationNumberBtn | pageSizeDropdown |
      | ExpediaGroup             | platformHealthResiliencyLink1 | paginationNextBtn | paginationPrevBtn | paginationNumberBtn | pageSizeDropdown |
      | Expedia                  | platformHealthResiliencyLink1 | paginationNextBtn | paginationPrevBtn | paginationNumberBtn | pageSizeDropdown |
      | Egencia                  | platformHealthResiliencyLink1 | paginationNextBtn | paginationPrevBtn | paginationNumberBtn | pageSizeDropdown |
      | Hotelscom                | platformHealthResiliencyLink1 | paginationNextBtn | paginationPrevBtn | paginationNumberBtn | pageSizeDropdown |
      | Vrbo                     | platformHealthResiliencyLink1 |                   |                   |                     |                  |
#      | ExpediaPartnerSolutions  | platformHealthResiliencyLink1 |                   |                   |                     |                  |
