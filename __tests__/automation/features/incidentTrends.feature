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
    Then click on overviewTab
    Then waiting for <overviewTabContainer>
    Then click on top5Tab
    Then waiting for <top5TabContainer>
    Then click on incidentsTab
    Then user selects start date
    Then user selects end date
    Then conditional click on paginationNextBtn <skipPagination>
    Then conditional click on paginationPrevBtn <skipPagination>
    Then conditional click on paginationNumberBtn <skipPagination>
    Then user selects one element of filter <pageSizeDropdown> pageSizeDropdownListElement
    Then user selects one element of filter <priorityDropdown> priorityDropdownOption
    Then user selects one element of filter <statusDropdown> statusDropdownOption
    Then user selects one element of filter <filterDropdown> <filterDropdownOption>
    Then click on moreFiltersButton
    Then waiting for moreFiltersContainer
    Then user selects one element of filter <rootCauseOwnerFilter> rootCauseOwnerFilterOption
    Then click on submitFilters

    Examples:
      | brand                    | link                          | skipPagination    | pageSizeDropdown | filterDropdown  | filterDropdownOption  | rootCauseOwnerFilter | priorityDropdown | statusDropdown | overviewTabContainer | top5TabContainer |
      | ExpediaGroup             | platformHealthResiliencyLink2 | false             |                  |                 |                       |                      |                  |                |                      |                  |
      | Expedia                  | platformHealthResiliencyLink2 | false             | pageSizeDropdown | tagDropdown     | tagDropdownOption     | rootCauseOwnerFilter | priorityDropdown | statusDropdown | overviewTabContainer | top5TabContainer |
      | Egencia                  | platformHealthResiliencyLink2 | true              |                  | tagDropdown     | tagDropdownOption     |                      | priorityDropdown | statusDropdown |                      |                  |
      | Hotelscom                | platformHealthResiliencyLink2 | false             | pageSizeDropdown | tagDropdown     | tagDropdownOption     | rootCauseOwnerFilter | priorityDropdown | statusDropdown | overviewTabContainer | top5TabContainer |
      | Vrbo                     | platformHealthResiliencyLink2 | false             |                  | tagDropdown     | tagDropdownOption     |                      | priorityDropdown | statusDropdown |                      | top5TabContainer |
      | ExpediaPartnerSolutions  | platformHealthResiliencyLink2 | false             |                  |                 |                       |                      |                  |                |                      |                  |
