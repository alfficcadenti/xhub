Feature: Verify user is able to navigate around Impulse Dashboard

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the <link>
    Then user wait for the data to load
    Then the current page title contain Impulse Dashboard
    Then user selects start date
    Then user selects end date
    Then user selects one element of filter <brandButton> <brandOption>
    Then click on <submit>
    Then user wait for the data to load
    Then click on <reset>
    Then user selects one element of filter <lobButton> <lobOption>
    Then click on <submit>
    Then user wait for the data to load
    Then click on <reset>
    Then user selects one element of filter <posButton> <posOption>
    Then click on <submit>
    Then user wait for the data to load
    Then click on <reset>
    Then user selects one element of filter <incidentsButton> <incidentsOption>
    Then click on <reset>
    Then user selects one element of filter <anomaliesButton> <anomaliesOption>
    Then click on <reset>
    Then user selects one element of filter <incidentsCheck> <anomaliesCheck>
    Then select advance filters
    Then click on <submit>
    Then user wait for the data to load
    Then click on <reset>
    Then user selects one element of filter <timeButton> <timeOption>
    Then click on <submit>
    Then user wait for the data to load
    Then click on <resetGraph>
    Then user wait for the data to load

    Examples:
    | brand                    | link                    | brandButton | brandOption        | lobButton | lobOption       | posButton | posOption       | incidentsButton | incidentsOption       | incidentsCheck    | anomaliesCheck    | timeButton    | timeOption          | anomaliesButton | anomaliesOption       | submit        | reset        | resetGraph |
    | ExpediaGroup             | availabilityTrendsLink1 | brandFilter | brandOptionFilter1 | lobFilter | lobOptionFilter | posFilter | posOptionFilter | incidentsFilter | incidentsOptionFilter | incidentsCheckbox | anomaliesCheckbox | setTimeFilter | setTimeFilterOption | anomaliesFilter | anomaliesOptionFilter | submitFilters | resetFilters | resetGraph |
    | Expedia                  | availabilityTrendsLink1 | brandFilter | brandOptionFilter1 | lobFilter | lobOptionFilter | posFilter | posOptionFilter | incidentsFilter | incidentsOptionFilter | incidentsCheckbox | anomaliesCheckbox | setTimeFilter | setTimeFilterOption | anomaliesFilter | anomaliesOptionFilter | submitFilters | resetFilters | resetGraph |
    | Egencia                  | availabilityTrendsLink1 | brandFilter | brandOptionFilter1 | lobFilter | lobOptionFilter | posFilter | posOptionFilter | incidentsFilter | incidentsOptionFilter | incidentsCheckbox | anomaliesCheckbox | setTimeFilter | setTimeFilterOption | anomaliesFilter | anomaliesOptionFilter | submitFilters | resetFilters | resetGraph |
    | Hotelscom                | availabilityTrendsLink2 | brandFilter | brandOptionFilter1 | lobFilter | lobOptionFilter | posFilter | posOptionFilter | incidentsFilter | incidentsOptionFilter | incidentsCheckbox | anomaliesCheckbox | setTimeFilter | setTimeFilterOption | anomaliesFilter | anomaliesOptionFilter | submitFilters | resetFilters | resetGraph |
    | Vrbo                     | availabilityTrendsLink1 | brandFilter | brandOptionFilter1 | lobFilter | lobOptionFilter | posFilter | posOptionFilter | incidentsFilter | incidentsOptionFilter | incidentsCheckbox | anomaliesCheckbox | setTimeFilter | setTimeFilterOption | anomaliesFilter | anomaliesOptionFilter | submitFilters | resetFilters | resetGraph |
    | ExpediaPartnerSolutions  | availabilityTrendsLink1 | brandFilter | brandOptionFilter1 | lobFilter | lobOptionFilter | posFilter | posOptionFilter | incidentsFilter | incidentsOptionFilter | incidentsCheckbox | anomaliesCheckbox | setTimeFilter | setTimeFilterOption | anomaliesFilter | anomaliesOptionFilter | submitFilters | resetFilters | resetGraph |