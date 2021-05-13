Feature: Verify user is able to navigate around Quality Metrics

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Platform Health & Resiliency Button
    Then user verify platformHealthResiliencyDropdown exist
    Then user go ahead and clicks on the <link>
    Then user wait for the data to load
    Then the current page title contain Quality Metrics
    Then click on checkoutInput
    Then click on applyButton
    Then user wait for the data to load
    Then waiting for qualityMetricsPanelContainer
    Then click on customerInput
    Then click on applyButton
    Then user wait for the data to load
    Then waiting for qualityMetricsPanelContainer
    Then click on qualityMetricsPanelCountLink
    Then waiting for modalContainer
    Then click on modalCloseButton
    Then waiting for qualityMetricsPanelContainer
    Then click on checkoutInput
    Then click on customerInput
    Then click on applyButton
    Then user wait for the data to load
    Then waiting for qualityMetricsNoResultsContainer

    Examples:
    | brand     | link                          |
    | Hotelscom | platformHealthResiliencyLink4 |
